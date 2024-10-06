// import { HELLO } from '@/code-case/move'
// import ProjectTrack from './ProjectTrack'
import Track from './Track'

export const AllTrack = () => {
  return (
    <>
      <div className="flex flex-col items-center mx-4 my-4">
        <p className="font-bold text-6xl mb-4">分步教程</p>
        <p className="font-bold text-xs mb-4">
          于课程：本课程涵盖 Aptos 上的数字资产标准以及如何创建创新而复杂的
          NFT。我们将从如何创建收藏品和铸造代币的基础知识开始，并探索我们可以用数字资产做的所有创造性的事情。完成本课程后，您可以在其应用程序中创建和使用数字资产。
        </p>
        <div className="py-4 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* <ProjectTrack /> */}
          <Track
            mdPath="/Docs/test-mermaid.md"
            cover="/images/cover/module_and_script.jpg"
            size="md"
            description="用于 Aptos Case 的测试"
            tags={['track']}
            title="测试"
            // codeCase={}
          >
            <p className="text-blue-500">
              附加内容
              <br />
              色温以开尔文 (K) 为单位。苏格兰数学家和物理学家威廉·开尔文于 1848
              年提出了绝对色温标度，即开尔文标度。该标度以 −273.15°C
              作为零点或“绝对零度”。令人困惑的是，开尔文标度与温度计上的标度方向相反，因此暖色（红色和橙色）的数值较低，约为
              2,000-3,000K，而冷色（蓝色和绿色）的数值较高，约为
              20,000K。中性白光为 6,504K。
            </p>
          </Track>

          {/* 添加更多 Case 组件 */}
        </div>
      </div>
    </>
  )
}
