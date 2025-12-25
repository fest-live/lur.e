// Export all reactive math functionality

// 1D Primitives (from fest/object)
export { numberRef, booleanRef } from "fest/object";

// 2D Vectors and Matrices
export { Vector2D, vector2Ref, Matrix2D, matrix2x2Ref } from "./Point2D";

// 3D Vectors and Matrices
export { Vector3D, vector3Ref, Matrix3D, matrix3x3Ref } from "./Point3D";

// 4D Vectors and Matrices
export { Vector4D, vector4Ref, Matrix4D, matrix4x4Ref } from "./Point4D";

// Operations and utilities
export * from "./Operations";

// Grid-specific mathematics
export * from "./GridMath";

// CSS integration and utilities
export * from "./CSSAdapter";

// Advanced utilities for custom reactive computations
export { operated } from "./Operations";

// Integration examples and enhanced components
export * from "../../test/integration-examples";
