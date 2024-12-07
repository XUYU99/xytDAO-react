import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChakraBaseProvider,
  Box,
  Text,
  Input,
  Button,
  Flex,
  Spacer,
  Progress,
} from "../setting/component";
import { proposeLog } from "../scripts/kokoDao/02-propose"; // 引入提案日志
import { voteLog } from "../scripts/kokoDao/03-vote"; // 引入投票日志
import { moveBlocks } from "../scripts/kokoDao/01-deploy"; // 引入 moveBlocks 函数

const ProposalData = () => {
  const navigate = useNavigate();

  // 跳转到提案详情页面
  const proposalDetailClick = () => {
    navigate("/ProposalDetail");
  };

  // 使用 React 的状态钩子存储
  const [proposalDataList, setProposalDataList] = useState([]); // 提案数据列表状态
  const [refreshFlag, setRefreshFlag] = useState(false); // 刷新标志

  // 统计提案支持情况
  const getSupportStatistics = (proposalId) => {
    // 筛选出当前提案的所有投票
    const proposalVotes = voteLog.filter(
      (vote) => vote.proposalId === proposalId
    );
    const totalVotes = proposalVotes.length; // 获取总投票数
    const supportStats = { oppose: 0, support: 0, abstain: 0 }; // 初始化支持统计

    // 统计支持、反对和弃权的投票数
    proposalVotes.forEach((vote) => {
      if (vote.support === "0") supportStats.oppose += 1;
      if (vote.support === "1") supportStats.support += 1;
      if (vote.support === "2") supportStats.abstain += 1;
    });

    // 计算支持、反对和弃权的百分比
    return {
      support: ((supportStats.support / totalVotes) * 100).toFixed(1) || 0,
      oppose: ((supportStats.oppose / totalVotes) * 100).toFixed(1) || 0,
      abstain: ((supportStats.abstain / totalVotes) * 100).toFixed(1) || 0,
    };
  };

  // 根据刷新标志更新提案数据列表
  useEffect(() => {
    setProposalDataList(proposeLog); // 将 proposeLog 更新到状态
  }, [refreshFlag]); // 每次刷新标志变化时触发

  // 定时每 5 秒更新一次刷新标志
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshFlag((prevFlag) => !prevFlag); // 切换刷新标志
    }, 5000);

    return () => clearInterval(interval); // 清除定时器，防止内存泄漏
  }, []);

  // moveBlocks 的按钮点击事件
  async function moveBlocksOnclick() {
    await moveBlocks(1);
  }

  return (
    <div>
      <ChakraBaseProvider>
        <Box margin="10px">
          {proposalDataList.map((proposalData) => {
            // 获取当前提案的支持统计数据
            const { support, oppose, abstain } = getSupportStatistics(
              proposalData.proposalId
            );

            return (
              <Box
                key={proposalData.proposalId} // 使用提案 ID 作为唯一键
                border="1px solid #E2E8F0"
                borderRadius="md"
                padding="8px"
                margin="30px 20px"
                maxW="380px"
                // maxH="1000px"
                boxShadow="md"
              >
                {/* 显示提案时间戳 */}
                <Text fontSize="12px" color="gray.500">
                  {proposalData.timestamp}
                </Text>

                {/* 提案详情，可点击 */}
                <Button
                  size="md"
                  variant="outline"
                  marginTop="3"
                  whiteSpace="normal"
                  wordBreak="break-all"
                  onClick={proposalDetailClick}
                >
                  Proposal Description: {proposalData.description}
                </Button>

                {/* 显示提案 ID */}
                <Text fontSize="13px" color="gray.500" marginTop="2">
                  Proposal ID: {proposalData.proposalId}
                </Text>

                {/* 提案状态 */}
                <Text fontSize="sm" color="gray.500" marginTop="2">
                  ⏰ POLL ENDED
                </Text>

                {/* 进度条显示支持情况 */}
                <Flex direction="column" marginTop="1">
                  <Box
                    position="relative"
                    width="100%"
                    height="10px"
                    borderRadius="md"
                    backgroundColor="gray.200"
                    overflow="hidden"
                  >
                    {/* 反对 */}
                    <Box
                      position="absolute"
                      top="0"
                      left="0"
                      height="100%"
                      width={`${oppose}%`}
                      backgroundColor="red.600"
                    ></Box>
                    {/* 支持 */}
                    <Box
                      position="absolute"
                      top="0"
                      left={`${oppose}%`}
                      height="100%"
                      width={`${support}%`}
                      backgroundColor="blue.600"
                    ></Box>
                    {/* 弃权 */}
                    <Box
                      position="absolute"
                      top="0"
                      right="0"
                      height="100%"
                      width={`${abstain}%`}
                      backgroundColor="yellow.400"
                    ></Box>
                  </Box>

                  {/* 显示支持统计数据 % */}
                  <Flex justifyContent="space-between" marginTop="2">
                    <Text fontSize="sm" color="gray.300">
                      Support {support}%
                    </Text>
                    <Text fontSize="sm" color="gray.300">
                      Oppose {oppose}%
                    </Text>
                    <Text fontSize="sm" color="gray.300">
                      Abstain {abstain}%
                    </Text>
                  </Flex>
                </Flex>

                {/* 显示交易哈希 */}
                <Button
                  size="md"
                  variant="outline"
                  marginTop="3"
                  whiteSpace="normal"
                  wordBreak="break-all"
                >
                  Transaction Hash:{" "}
                  {proposalData.transactionHash
                    ? proposalData.transactionHash.slice(0, 5) + "..."
                    : ""}
                </Button>
              </Box>
            );
          })}

          {/* 刷新按钮 */}
          <Button
            fontSize="18px"
            margin="10px"
            onClick={() => setRefreshFlag((prevFlag) => !prevFlag)}
          >
            Refresh
          </Button>

          {/* 手动触发 moveBlocks */}
          <Button fontSize="18px" margin="10px" onClick={moveBlocksOnclick}>
            moveBlocks
          </Button>
        </Box>
      </ChakraBaseProvider>
    </div>
  );
};

export default ProposalData; // 导出 ProposalData 组件
