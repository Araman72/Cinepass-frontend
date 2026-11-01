import { Environment, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React from 'react'

function Theater2() {
  return (
    <div>
        <Canvas>
            <OrbitControls  
             autoRotate={true}
                          autoRotateSpeed={1.0}
            
            />
            <Environment files="earth.hdr"
                         background
                         
                          
                        />
        </Canvas>
    </div>
  )
}

export default Theater2