import React from 'react';
import {Canvas} from "@react-three/fiber";
import { Mesh } from 'three';
import {Environment, OrbitControls} from '@react-three/drei';
import './index.css';



function Theater() {
  return (

<Canvas>
<Environment files="theater.hdr" background />
<mesh>
    <OrbitControls 
    enableDamping={true}
    dampingFactor={0.05}
    />
    
  
</mesh>
</Canvas>
  )
}

export default Theater