import React, { useEffect, useRef, useState } from 'react'
import { addIronMan, addFurniture, addDoor,addWall, addBird } from './objects'

import {
    FreeCamera,
    ArcRotateCamera,
    Vector3,
    Color3,
    HemisphericLight,
    MeshBuilder,
    Scene,
    SceneLoader,
    Mesh,
    HavokPlugin,
    Engine,
    ActionManager,
    ExecuteCodeAction,
} from '@babylonjs/core'
import SceneComponent from 'babylonjs-hook' // if you install 'babylonjs-hook' NPM.
import HavokPhysics from '@babylonjs/havok'
import '../css/Modeling.css'
import '@babylonjs/loaders'
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, rootReducer } from '../redux/modules/reducer'
import { changeTextInput, askGpt } from '../redux/modules/actions'
import { store } from '../index'

let initializedHavok

HavokPhysics().then((havok) => {
    initializedHavok = havok
})

let ground: Mesh
let wall1: Mesh
let wall2: Mesh
let wall3: Mesh
let wall4: Mesh
let ceiling: Mesh

let sphere

const PI = Math.PI

const onSceneReady = async (scene: Scene) => {
    // This creates and positions a free camera (non-mesh)
    var camera = new FreeCamera('camera1', new Vector3(0, 40, 100), scene)
    // const camera = new ArcRotateCamera(
    //     'camera',
    //     -Math.PI / 2,
    //     Math.PI / 2.5,
    //     10,
    //     new Vector3(0, 100, 100)
    // )
        
    // This targets the camera to scene origin
    camera.setTarget(Vector3.Zero())
    camera.angularSensibility = 2000
     camera.speed=1
   
    const canvas = scene.getEngine().getRenderingCanvas()

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true)

    // Set the camera as the active camera
    scene.activeCamera = camera

    const assumedFramesPerSecond = 60
    const earthGravity = -20.81
    scene.gravity = new Vector3(0, earthGravity / assumedFramesPerSecond, 0)
    camera.applyGravity = true

    camera.ellipsoid = new Vector3(3, 7, 3)
    scene.collisionsEnabled = true
    camera.checkCollisions = true

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new HemisphericLight('light', new Vector3(0, 1, 0), scene)

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.4

    //Plain ground
    ground = MeshBuilder.CreateGround('ground', { width: 100, height: 800 })
    ground.position = new Vector3(0, 2, 0)
    ground.checkCollisions = true
    ground.isVisible=false

    const box = MeshBuilder.CreateBox("box",{size:20}, scene); //scene is 
    box.checkCollisions=true
    box.position=new Vector3(30, 10, 40)

    const box2 = MeshBuilder.CreateBox("box",{size:20}, scene); //scene is 
    box2.scaling=new Vector3(3,1,1)
    box2.checkCollisions=true
    box2.position=new Vector3(-28, 10, 45)

    const box3 = MeshBuilder.CreateBox("box",{size:20}, scene); //scene is 
    box3.checkCollisions=true
    box3.position=new Vector3(-18, 10, 18)

    const box4 = MeshBuilder.CreateBox("box",{size:20}, scene); //scene is 
    box4.checkCollisions=true
    box4.position=new Vector3(-33, 10, -25)

    box.isVisible=false
    box2.isVisible=false
    box3.isVisible=false
    box4.isVisible=false
    
    //wall
    // wall1 = MeshBuilder.CreateGround('ground', { width: 100, height: 30 })
    // wall1.position = new Vector3(0, 15, -50)
    // wall1.rotation = new Vector3(PI / 2, 0, 0)
    // wall1.checkCollisions = true

    wall2 = MeshBuilder.CreateGround('ground', { width: 500, height: 30 })
    wall2.position = new Vector3(-50, 15, 0)
    wall2.rotation = new Vector3(PI / 2, PI / 2, 0)
    wall2.checkCollisions = true
    wall2.isVisible=false

    wall3 = MeshBuilder.CreateGround('ground', { width: 500, height: 30 })
    wall3.position = new Vector3(50, 15, 0)
    wall3.rotation = new Vector3(PI / 2, 0, PI / 2)
    wall3.checkCollisions = true
    wall3.isVisible=false
    // wall4 = MeshBuilder.CreateGround('ground', { width: 100, height: 30 })
    // wall4.position = new Vector3(0, 15, 50)
    // wall4.rotation = new Vector3(PI / 2, -PI / 2, PI / 2)
    // wall4.checkCollisions = true

    // ceiling = MeshBuilder.CreateGround('ground', { width: 100, height: 100 })
    // ceiling.position = new Vector3(0, 30, 0)
    // ceiling.rotation = new Vector3(PI, 0, 0)
    // ceiling.checkCollisions = true

    //ground.checkCollisions = true;
    const gravity = new Vector3(0, -10, 0)

    const hk = await HavokPhysics()
    const babylonPlugin = new HavokPlugin(true, hk)
    scene.enablePhysics(gravity, babylonPlugin)

    //addIronMan(scene)
    addBird(scene)
    addFurniture(scene)
    addDoor(scene)
   addWall(scene)
}

/**
 * Will run on every frame render.  We are spinning the box on y-axis.
 */


let previousCameraPosition = new Vector3(); // 이전 프레임의 카메라 위치를 저장할 변수

const onRender = (scene: Scene) => {
    if (ground !== undefined) {
        var deltaTimeInMillis = scene.getEngine().getDeltaTime()
    }

    let bird: any = scene.getMeshByName("bird")

    if (bird) {
        const camera = scene.activeCamera

        if (camera) {
            // 카메라의 현재 위치와 이전 위치를 비교하여 움직였는지 확인
            const cameraMoved = !camera.position.equalsWithEpsilon(previousCameraPosition, 0.01) // 카메라의 위치 변화 감지

            if (cameraMoved) {
                // 카메라가 움직였을 때만 bird의 위치를 갱신
                const rightDirection = camera.getDirection(new Vector3(1, 0, 0)) // 카메라의 오른쪽 방향
                const backDirection = camera.getDirection(new Vector3(0, 0, -1)) // 카메라의 뒤쪽 방향

                // bird가 카메라의 우측 뒤에 위치하도록 설정
                const desiredPosition = camera.position
                    .add(rightDirection.scale(10)) // 우측으로 10만큼 이동
                    .add(backDirection.scale(-20))  // 뒤로 5만큼 이동
                    .add(new Vector3(0, -10, 0))  // 카메라보다 아래에 위치

                // bird의 위치를 부드럽게 이동
                bird.position = Vector3.Lerp(bird.position, desiredPosition, 0.05)
            }

            // 현재 카메라 위치를 이전 위치로 저장
            previousCameraPosition.copyFrom(camera.position)
        }
    }
}

export default () => {
    const [ask, setAsk] = useState('')
    const handleChange = ({ target: { value } }: any) => setAsk(value)
    const dispatch = useDispatch()
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const textInputState = useSelector(
        (state: RootState) => state.textInputReducer
    )
    const gptRespnseState = useSelector(
        (state: RootState) => state.gptAskReducer
    )
    //   const pickBox2=()=>{
    //    dispatch(changeTextInput())
    //   }
    useEffect(() => {
        const canvas: any = document.getElementById('modeler')
        const engine: any = new Engine(canvas)
        canvas.width = 800
        canvas.height = 400

        const handleKeyDown = (e: KeyboardEvent) => {
            if (canvas && document.activeElement === canvas) {
                if (!['w', 'a', 's', 'd', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key.toLowerCase())) {
                    e.preventDefault()
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }

    }, [])


    const handleSubmit = async (event: any) => {
        console.log(ask)
        event.preventDefault()
        await dispatch(askGpt(ask))
        await store.dispatch(changeTextInput())
        console.log(gptRespnseState)
    }

    return (
        <div>
            <SceneComponent
                antialias
                onSceneReady={onSceneReady}
                onRender={onRender}
                id="modeler"
            />
            <div style={{marginTop:-200,marginLeft:300}}>
                {textInputState.toggle ? (
                    <form onSubmit={handleSubmit} >
                        <input
                            type="text"
                            className="askGpt"
                            placeholder="Ask to bird"
                            value={ask}
                            onChange={handleChange}
                            style={{backgroundColor:'transparent', fontSize:20}}
                        ></input>{' '}
                        <button type="submit"
                        style={{backgroundColor:'transparent', fontSize:20}}
                        >Ask</button>
                    </form>
                ) : (
                    ''
                )}
            </div>
        </div>
    )
}
