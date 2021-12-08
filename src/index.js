import ReactDOM from "react-dom"
import React, { useRef, useState, useContext, useCallback } from "react"
import { Canvas } from "@react-three/fiber"
import { EffectComposer, Outline } from "@react-three/postprocessing"
import "./styles.css"

function useHover() {
  const ref = useRef()
  const setHovered = useContext(context)
  const onPointerOver = useCallback(() => setHovered((state) => [...state, ref.current]), [])
  const onPointerOut = useCallback(() => setHovered((state) => state.filter((mesh) => mesh !== ref.current)), [])
  return { ref, onPointerOver, onPointerOut }
}

const Thing = ({ radius = 1, detail = 64, color = "indianred", ...props }) => {
  return (
    <mesh {...props} {...useHover()}>
      <dodecahedronGeometry attach="geometry" args={[50]} />
      <meshStandardMaterial attach="material" color={color} />
    </mesh>
  )
}

const context = React.createContext()
const Outlined = ({ children }) => {
  const [hovered, set] = useState([])

  return (
    <context.Provider value={set}>
      {children}

      <EffectComposer autoClear={false}>
        <Outline selection={hovered} visibleEdgeColor={0xffffff} edgeStrength={100} width={1500} hiddenEdgeColor={0xffffff} />
      </EffectComposer>
    </context.Provider>
  )
}

const App = () => (
  <Canvas pixelRatio={window.devicePixelRatio} orthographic camera={{ position: [0, 0, 500], far: 10000 }}>
    <ambientLight intensity={1.5} />
    <pointLight position={[10, 10, 10]} />
    <Outlined>
      <Thing position={[0, 50, 0]} color="hotpink" />
      <Thing position={[-50, -50, 0]} color="indianred" />
      <Thing position={[50, -50, 0]} color="lightgreen" />
    </Outlined>
  </Canvas>
)

ReactDOM.render(<App />, document.getElementById("root"))
