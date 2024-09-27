import React from 'react'
import {
    Vector3,
    Color3,
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
import Assets from '@babylonjs/assets'
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial'
import { store } from '../index'
import { useSelector, useDispatch } from 'react-redux'
import { changeTextInput, askGpt } from '../redux/modules/actions'
import { RootState } from '../redux/modules/reducer'

let initializedHavok

HavokPhysics().then((havok) => {
    initializedHavok = havok
})

const PI = Math.PI

// [desk, chair_gaming, bed, ber_ceiling, couch, holo_table, lab_machine, bar_table]
const addFurniture = (scene: Scene) => {
    const assetsToLoad = [
        {
            url: '../assets/',
            filename: 'desk_cyberpunk.glb',
            position: new Vector3(50, -2.3, -22),
            scaling: new Vector3(4, 4, 4),
            rotation: new Vector3(0, 0, 0),
            // color: new Color3(1, 0, 0),
        },
        {
            url: '../assets/',
            filename: 'chair_gaming.glb',
            position: new Vector3(25, 0, -30),
            scaling: new Vector3(11, 11, 11),
            rotation: new Vector3(0, PI / 4, 0),
            // color: new Color3(1, 0, 0),
        },
        {
            url: '../assets/',
            filename: 'bed.glb',
            position: new Vector3(-30, 0, -30),
            scaling: new Vector3(0.15, 0.15, 0.15),
            rotation: new Vector3(0, -PI / 2, 0),
            // color: new Color3(1, 0, 0),
        },
        {
            url: '../assets/',
            filename: 'bed_ceiling.glb',
            position: new Vector3(-30, 14, -35),
            scaling: new Vector3(19, 19, 19),
            rotation: new Vector3(0, 0, 0),
            // color: new Color3(1, 0, 0),
        },
        {
            url: '../assets/',
            filename: 'couch.glb',
            position: new Vector3(-20, 0, 40),
            scaling: new Vector3(0.06, 0.06, 0.06),
            rotation: new Vector3(0, PI, 0),
            // color: new Color3(1, 0, 0),
        },
        {
            url: '../assets/',
            filename: 'holo-table.glb',
            position: new Vector3(-20, 0, 18),
            scaling: new Vector3(7, 7, 7),
            rotation: new Vector3(0, 0, 0),
            // color: new Color3(1, 0, 0),
        },
        {
            url: '../assets/',
            filename: 'lab_machine.glb',
            position: new Vector3(33, 0, 52),
            scaling: new Vector3(9, 9, 9),
            rotation: new Vector3(0, PI, 0),
            // color: new Color3(1, 0, 0),
        },
        {
            url: '../assets/',
            filename: 'bar_table.glb',
            position: new Vector3(60, 0, 30),
            scaling: new Vector3(5, 5, 5),
            rotation: new Vector3(0, PI, 0),
            // color: new Color3(1, 0, 0),
        },
    ]

    assetsToLoad.forEach((asset) => {
        SceneLoader.ImportMesh(
            '',
            asset.url,
            asset.filename,
            scene,
            (meshes) => {
                console.log(meshes)
                for(var i =0; i<meshes.length/2;i++){
                const mesh = meshes[i]
                meshes[0].position = asset.position
                meshes[0].rotation = asset.rotation
                meshes[0].scaling = asset.scaling
                mesh.checkCollisions = true
                }
                
            }
        )
    })
}

const addDoor = (scene: Scene) => {
    const assetsToLoad = [
        {
            url: '../assets/',
            filename: 'door.glb',
            position: new Vector3(50, 0, -8),
            scaling: new Vector3(0.1, 0.1, 0.1),
            rotation: new Vector3(0, PI, 0),
            // color: new Color3(1, 0, 0),
        },
        {
            url: '../assets/',
            filename: 'door_screen.glb',
            position: new Vector3(47, 5, -20),
            scaling: new Vector3(10, 10, 10),
            rotation: new Vector3(0, -PI / 2, 0),
            // color: new Color3(1, 0, 0),
        },
    ]
    assetsToLoad.forEach((asset) => {
        SceneLoader.ImportMesh(
            '',
            asset.url,
            asset.filename,
            scene,
            (meshes) => {
                console.log(meshes)
                for(var i =0; i<meshes.length;i++){
                const mesh = meshes[i]
                meshes[0].position = asset.position
                meshes[0].rotation = asset.rotation
                meshes[0].scaling = asset.scaling
                mesh.checkCollisions = true
                }
            }
        )
    })
}

const tryChat = async () => {
    await store.dispatch(changeTextInput())
}

//Ironman
const addIronMan = (scene: Scene) => {
    SceneLoader.ImportMesh(
        '',
        '../assets/',
        'IronMan.gltf',
        scene,
        (meshes) => {
            console.log(meshes)

            for (var i = 0; i < meshes.length; i++) {
                const mesh = meshes[i]
                mesh.position.set(0, 0, 0)
                mesh.rotation = new Vector3(0, 0, 0)
                mesh.scaling.setAll(0.2)
                mesh.name="robot"
                //mesh.checkCollisions = true
                mesh.actionManager = new ActionManager(scene)
                mesh.actionManager.registerAction(
                    new ExecuteCodeAction(ActionManager.OnPickTrigger, tryChat)
                )
            }
        }
    )
}

//Bird
const addBird = (scene: Scene) => {
    SceneLoader.ImportMesh(
        '',
        '../assets/',
        'bird.glb',
        scene,
        (meshes) => {
            console.log(meshes)

            for (var i = 0; i < meshes.length; i++) {
                const mesh = meshes[i]
                mesh.position.set(0, 0, 0)
                mesh.rotation = new Vector3(0, Math.PI, 0)  // Y축을 기준으로 180도 회전
                mesh.scaling.setAll(1)
                mesh.name = "bird"
                // mesh.checkCollisions = true
                mesh.actionManager = new ActionManager(scene)
                mesh.actionManager.registerAction(
                    new ExecuteCodeAction(ActionManager.OnPickTrigger, tryChat)
                )
            }
        }
    )
}

const addWall = (scene: Scene) => {
    SceneLoader.ImportMesh(
        '',
        '../assets/',
        'sceneWall.glb',
        scene,
        (meshes) => {
            console.log(meshes)

            for (var i = 0; i < meshes.length; i++) {
                const mesh = meshes[i]
                mesh.position.set(0, 6, 0)
                mesh.rotation = new Vector3(0, 0, 0)
                mesh.scaling.setAll(5)
                mesh.checkCollisions = true

                
            }
        }
    )
}

export { addIronMan, addFurniture, addDoor,addWall, addBird }
