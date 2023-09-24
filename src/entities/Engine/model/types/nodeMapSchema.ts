import { EntityState } from '@reduxjs/toolkit'
import { NodeType } from '../logic/Nodes/Node'

export interface nodeMapSchema extends EntityState<NodeType> {}
