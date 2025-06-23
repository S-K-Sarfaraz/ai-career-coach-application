import React from 'react'
import { Background, Controls, MiniMap, ReactFlow } from '@xyflow/react';
 
import '@xyflow/react/dist/style.css';
import '@xyflow/react/dist/style.css';
import TurboNode from './TurboNode';

const RoadmapCanvas = ({initialNodes,initialEdges}:any) => {

    const nodeType ={
        turbo: TurboNode
    }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow nodes={initialNodes} edges={initialEdges} nodeTypes={nodeType}>
        <Controls />
        <MiniMap />
        {/* @ts-ignore */}
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  )
}

export default RoadmapCanvas