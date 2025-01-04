// @ts-types="@types/three"
import { ConeGeometry, Group, Mesh, MeshBasicMaterial, SphereGeometry, Vector3 } from "three";
import VehicleGraph, { UP } from "./VehicleGraph.ts";
import VehicleGraphNode from "./VehicleGraphNode.ts";

const NODE_GEOMETRY = new SphereGeometry(0.05, 6, 6);
const EDGE_GEOMETRY = new ConeGeometry(0.04, 1, 6);

const EDGE_MATERIAL = new MeshBasicMaterial({ color: '#5050ff' });
const CONNECTED_MATERIAL = new MeshBasicMaterial({ color: '#00ff00' });
const DISCONNECTED_MATERIAL = new MeshBasicMaterial({ color: '#ff0000' });

export default class VehicleGraphHelper extends Group {  
  constructor() {
    super();

    console.log('VehicleGraph:: Helper :: new()');
  }

  draw = (graph: VehicleGraph) => {
    this.clear();
    for (let x = 0; x < graph.size; x++) {
      for (let y = 0; y < graph.size; y++) {
        const tile = graph.getTile(x, y);
        if (tile) {
          for (const node of tile.children) {
            this.createNodeVisualization(node as VehicleGraphNode);
          }
        }
      }
    }
  };
  
  createNodes = (node: VehicleGraphNode) => {
    const nodeMesh = new Mesh(
      NODE_GEOMETRY,
      node.next.length ? CONNECTED_MATERIAL : DISCONNECTED_MATERIAL
    );
    
    const nodeWorldPosition = new Vector3();
    node.getWorldPosition(nodeWorldPosition);
    
    nodeMesh.position.set(
      nodeWorldPosition.x,
      nodeWorldPosition.y,
      nodeWorldPosition.z,
    );
    
    this.add(nodeMesh);
  };

  createEdges = (node: VehicleGraphNode) => {
    if (!node.next.length) {
      return;
    }

    const nodeWorldPosition = new Vector3();
    node.getWorldPosition(nodeWorldPosition);

    for (const nextNode of node.next) {
      const nextWorldPosition = new Vector3;
      nextNode.getWorldPosition(nextWorldPosition);
      
      const edgeVector = new Vector3();
      edgeVector.copy(nextWorldPosition);
      edgeVector.sub(nodeWorldPosition);      
      
      const distance = edgeVector.length();
      edgeVector.normalize();

      const edgeMesh = new Mesh(EDGE_GEOMETRY, EDGE_MATERIAL);
      
      edgeMesh.scale.set(1, distance, 1);
      edgeMesh.quaternion.setFromUnitVectors(UP, edgeVector);
      
      const offset = new Vector3(0, distance * 0.5, 0);
      offset.applyQuaternion(edgeMesh.quaternion.clone());
     
      edgeMesh.position.set(
        nodeWorldPosition.x + offset.x,
        nodeWorldPosition.y + offset.y,
        nodeWorldPosition.z + offset.z,
      );

      this.add(edgeMesh);
    }
  };

  createNodeVisualization = (node: VehicleGraphNode) => {
    this.createNodes(node);
    this.createEdges(node);
  };
}
