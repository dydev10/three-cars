// @ts-types="@types/three"
import { Group, Mesh, Quaternion } from "three";
import RAPIER, { ColliderDesc, RigidBodyDesc } from "@dimforge/rapier3d";
import Game from "./Game.ts";

export type PhysicsBodyType = 'fixed' | 'dynamic' | 'kinematic';
export type PhysicsColliderShape = 'cuboid' | 'capsule';
export type PhysicsTransform = {
  position?: {x: number, y: number, z: number};
  rotation?: Quaternion;
}
export type PhysicsColliderDesc = PhysicsTransform & {
  shape: PhysicsColliderShape;
  parameters: Array<number>;
}
export type PhysicsBodyDesc = PhysicsTransform & {
  type: PhysicsBodyType,
  collider: PhysicsColliderDesc;
}

export type PhysicsEntity = {
  key: number;
  body: RAPIER.RigidBody;
  mesh: Mesh | Group;
}

export default class Physics {
  game: Game;
  world: RAPIER.World;
  entityKey: number;
  entities: Map<number, PhysicsEntity>;
  
  constructor() {
    this.game = Game.Instance;
    this.world = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 });
    this.entityKey = 0;
    this.entities = new Map();

    // @ts-expect-error why-never-expected
    this.game.time.addEventListener('tick', this.update);
  }

  update = () => {
    this.world.timestep = this.game.time.delta;
    this.world.step();

    this.entities.forEach(({ body, mesh }) => {
      if (mesh) {
        mesh.position.copy(body.translation());
        mesh.quaternion.copy(body.rotation());
      }
    });
  };

  setTransforms = (bodyDesc: RigidBodyDesc | ColliderDesc, transform: PhysicsTransform) : RigidBodyDesc | ColliderDesc => {
    const { position, rotation } = transform;
    if (position) {
      bodyDesc.setTranslation(position.x || 0, position.y || 0, position.z || 0);
    }
    if (rotation) {
      bodyDesc.setRotation(rotation);
    }

    return bodyDesc;
  };

  createPhysicsCollider = (desc: PhysicsColliderDesc, body: RAPIER.RigidBody) => {
    let colliderDesc: RAPIER.ColliderDesc | null = null;

    if(desc.shape === 'cuboid') {
      const { parameters } = desc;
      colliderDesc = RAPIER.ColliderDesc.cuboid(parameters[0], parameters[1], parameters[2]);
      this.setTransforms(colliderDesc, desc);
      this.world.createCollider(colliderDesc, body);
    }
  };

  createPhysicsBody = (desc: PhysicsBodyDesc, mesh?: Mesh | Group): RAPIER.RigidBody => {
    let body: RAPIER.RigidBody | null = null;
    
    if (desc.type === 'fixed') {
      const rigidBodyDesc = RAPIER.RigidBodyDesc.fixed();
      this.setTransforms(rigidBodyDesc, desc);
      body = this.world.createRigidBody(rigidBodyDesc);
    }

    if (desc.type === 'dynamic') {
      const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic();
      this.setTransforms(rigidBodyDesc, desc);
      body = this.world.createRigidBody(rigidBodyDesc);
    }

    if(body && desc.collider) {
      this.createPhysicsCollider(desc.collider, body);
    }

    // copy rotation from mesh
    if (mesh) {
      body?.setRotation(mesh.quaternion, true);
    }

    return body;
  };

  addEntity = (mesh: Mesh | Group, body: PhysicsBodyDesc): PhysicsEntity => {
    const entity = {
      mesh,
      body: this.createPhysicsBody(body, mesh) as RAPIER.RigidBody,
      key: this.entityKey,
    };
    
    this.entities.set(this.entityKey, entity);
    this.entityKey++;
    
    return entity;
  };

  removeEntityByKey = (key: number): void => {
    const entity = this.entities.get(key);
    if (entity) {
      this.world.removeRigidBody(entity.body);
      this.entities.delete(key);
    }
  };
}
