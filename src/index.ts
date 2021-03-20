import "pepjs";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { GridMaterial } from "@babylonjs/materials/grid";

// Required side effects to populate the Create methods on the mesh class.
// Without this, the bundle would be smaller but the createXXX methods from mesh would not be accessible.
import "@babylonjs/core/Meshes/meshBuilder";

import bricksTextureUrl from "../assets/bricks.png";

export async function createScene(engine: Engine, canvas: HTMLCanvasElement): Promise<Scene> {
  // Create our first scene.
  const scene = new Scene(engine);

  // This creates and positions a free camera (non-mesh)
  const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);

  // This targets the camera to scene origin
  camera.setTarget(Vector3.Zero());

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  // Create a grid material
  const material = new GridMaterial("grid", scene);

  // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
  const sphere = Mesh.CreateSphere("sphere1", 16, 2, scene);

  // Move the sphere upward 1/2 its height
  sphere.position.y = 2;

  // Affect a material
  sphere.material = material;

  // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
  const ground = Mesh.CreateGround("ground1", 6, 6, 2, scene);

  // Load a texture to be used as the ground material
  const groundMaterial = new StandardMaterial("ground material", scene);
  groundMaterial.diffuseTexture = new Texture(bricksTextureUrl, scene);
  ground.material = groundMaterial;

  return scene;
}

export async function init(rootId: string): Promise<void> {
  // Get the canvas element from the DOM.
  const canvas = document.getElementById(rootId) as HTMLCanvasElement;

  // Associate a Babylon Engine to it.
  const engine = new Engine(canvas, true);

  // Create a scene
  const scene = await createScene(engine, canvas);

  // Render every frame
  engine.runRenderLoop(() => {
    scene.render();
  });

  // Watch for browser/canvas resize events
  window.addEventListener("resize", () => {
    engine.resize();
  });
}

init("renderCanvas");
