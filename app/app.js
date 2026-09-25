'use strict';

// Hide the FPS watermark without changing files under core/
debugWatermark = false;
debugOverlay = false;

const cubeList = [];
const core = {
  body: null,
};

function buildScene() {
  new Render3DPlugin();
  render3D.setSky(hsl(.58, .4, .72), hsl(.63, .8, .88), hsl(.25, .45, .36));
  render3D.ambientColor = hsl(.6, .2, .35);
  render3D.sunDirection = vec3(-.5, 1, .2);
  render3D.shadows = true;
  render3D.shadowRange = 40;
  render3D.shadowMapSize = 2048;
  render3D.camera.far = 200;

  const ground = new EngineObject3D(vec3(0, -1.5, 0), buildBox(vec3(24, 1, 24)));
  ground.color = hsl(.25, .35, .45);
  ground.specular = .4;
  ground.receiveShadow = true;

  const ringMesh = buildTorus(5, 1, 24, 12);
  for (let i = 0; i < 10; i++) {
    const ring = new EngineObject3D(vec3(0, 0, 0), ringMesh);
    ring.pos3D.y = 0.5 + i * 1.1;
    ring.rotation3D = vec3(0, i * .6, i * .8);
    ring.color = hsl((i / 10) * .9, .8, .6);
    ring.specular = 1;
    ring.castShadow = true;
    cubeList.push(ring);
  }

  for (let i = 0; i < 20; i++) {
    const box = new EngineObject3D(
      vec3(rand(-8, 8), rand(0.5, 4), rand(-8, 8)),
      buildBox(rand(0.7, 1.8))
    );
    box.color = hsl(rand(.1, .9), .8, .6);
    box.specular = .8;
    box.castShadow = true;
    cubeList.push(box);
  }

  core.body = new EngineObject3D(vec3(0, 1.8, 0), buildSphere(2.6));
  core.body.color = hsl(.15, .7, .65);
  core.body.specular = 1;
  core.body.emissive = .15;
  core.body.castShadow = true;

  new Light3D(vec3(-5, 4, 3), 18, hsl(.9, .85, .8), 1.4);
  new Light3D(vec3(6, 3, -4), 16, hsl(.15, 1, .7), 1.1);
  new CameraControl3D(vec3(0, 1.5, 0), 12, .62, 0);
}

function gameInit() {
  buildScene();
}

function gameUpdate() {
  const t = time * 1.2;
  for (let i = 0; i < cubeList.length; i++) {
    const obj = cubeList[i];
    obj.rotation3D.x += 0.01 + i * 0.0004;
    obj.rotation3D.y += 0.012 + i * 0.0005;
    obj.pos3D.x += sin(t + i) * 0.003;
    obj.pos3D.z += cos(t * 1.2 + i * 1.3) * 0.003;
  }

  if (core.body) {
    core.body.rotation3D.y += 0.02;
    core.body.rotation3D.x += 0.013;
    core.body.pos3D.y = 1.8 + sin(t * 2.3) * 0.7;
  }
}

function gameRender() {
  drawRect(vec2(-1, -1), vec2(2, 2), CLEAR_BLACK);
}

function gameRenderPost() {
}

engineInit(gameInit, gameUpdate, undefined, gameRender, gameRenderPost);
