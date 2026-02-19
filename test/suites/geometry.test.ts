/**
 * Chapter 2: Rectangle & Geometry Tests
 *
 * Tests for:
 * - Rect2D: creation, center, area
 * - Collision detection: point containment, rectangle intersection
 * - Spatial operations: clamping, distance, union
 * - Transformations: scaling, aspect ratio constraints
 * - UI controls: slider positions, scroll metrics, easing
 */

import { numberRef } from "fest/object";
import {
    Vector2D, vector2Ref,
    Rect2D, createRect2D, rectCenter, rectContainsPoint, rectIntersects,
    rectArea, clampPointToRect, pointToRectDistance, constrainRectAspectRatio,
    rectUnion, scaleRectAroundCenter,
    sliderThumbPosition, scrollbarMetrics, screenToControlValue,
    easeInOutCubic, easeOutBounce, momentumScroll, scrollBoundsWithBounce,
    smoothValueTransition
} from "../../src/math/index";

import type { TestRunner as TestRunnerType } from "../index";

export function runGeometryTests(TestRunner: typeof TestRunnerType) {
    console.log("\n📐 CHAPTER 2: Rectangle & Geometry Tests\n");

    // =========================================================================
    // Section 2.1: Rect2D Creation and Properties
    // =========================================================================
    TestRunner.setCategory("2.1 Rect2D Basics");

    // Creation
    const rect1 = createRect2D(10, 20, 100, 50);
    TestRunner.assertEqual(rect1.position.x.value, 10, "Rect2D position x");
    TestRunner.assertEqual(rect1.position.y.value, 20, "Rect2D position y");
    TestRunner.assertEqual(rect1.size.x.value, 100, "Rect2D size width");
    TestRunner.assertEqual(rect1.size.y.value, 50, "Rect2D size height");

    // Default values
    const rectDefault = createRect2D();
    TestRunner.assertEqual(rectDefault.position.x.value, 0, "Rect2D default x is 0");
    TestRunner.assertEqual(rectDefault.size.x.value, 0, "Rect2D default width is 0");

    // With reactive refs
    const xRef = numberRef(5);
    const yRef = numberRef(15);
    const rectWithRefs = createRect2D(xRef, yRef, 200, 100);
    TestRunner.assertEqual(rectWithRefs.position.x.value, 5, "Rect2D with ref x");
    TestRunner.assertEqual(rectWithRefs.position.y.value, 15, "Rect2D with ref y");

    // =========================================================================
    // Section 2.2: Rect2D Center and Area
    // =========================================================================
    TestRunner.setCategory("2.2 Rect2D Center & Area");

    // Center calculation
    const rectForCenter = createRect2D(0, 0, 100, 100);
    const center = rectCenter(rectForCenter);
    TestRunner.assertEqual(center.x.value, 50, "rectCenter x");
    TestRunner.assertEqual(center.y.value, 50, "rectCenter y");

    // Offset rectangle center
    const offsetRect = createRect2D(20, 40, 60, 80);
    const offsetCenter = rectCenter(offsetRect);
    TestRunner.assertEqual(offsetCenter.x.value, 50, "rectCenter offset x (20 + 60/2)");
    TestRunner.assertEqual(offsetCenter.y.value, 80, "rectCenter offset y (40 + 80/2)");

    // Area
    const areaRect = createRect2D(0, 0, 10, 20);
    const area = rectArea(areaRect);
    TestRunner.assertEqual(area.value, 200, "rectArea (10 * 20)");

    // Zero area
    const zeroAreaRect = createRect2D(0, 0, 0, 100);
    const zeroArea = rectArea(zeroAreaRect);
    TestRunner.assertEqual(zeroArea.value, 0, "rectArea with zero width");

    // =========================================================================
    // Section 2.3: Point Containment
    // =========================================================================
    TestRunner.setCategory("2.3 Point Containment");

    const containerRect = createRect2D(10, 10, 100, 100);

    // Helper to get value from result (may be raw boolean or ref with .value)
    const getValue = (result: any): any => {
        return typeof result === 'object' && result !== null && 'value' in result
            ? result.value
            : result;
    };

    // Point inside
    const pointInside = vector2Ref(50, 50);
    const insideResult = rectContainsPoint(containerRect, pointInside);
    TestRunner.assert(!!getValue(insideResult), "rectContainsPoint: point inside");

    // Point outside (left)
    const pointLeft = vector2Ref(5, 50);
    const leftResult = rectContainsPoint(containerRect, pointLeft);
    TestRunner.assert(!getValue(leftResult), "rectContainsPoint: point left of rect");

    // Point outside (right)
    const pointRight = vector2Ref(120, 50);
    const rightResult = rectContainsPoint(containerRect, pointRight);
    TestRunner.assert(!getValue(rightResult), "rectContainsPoint: point right of rect");

    // Point outside (top)
    const pointTop = vector2Ref(50, 5);
    const topResult = rectContainsPoint(containerRect, pointTop);
    TestRunner.assert(!getValue(topResult), "rectContainsPoint: point above rect");

    // Point outside (bottom)
    const pointBottom = vector2Ref(50, 120);
    const bottomResult = rectContainsPoint(containerRect, pointBottom);
    TestRunner.assert(!getValue(bottomResult), "rectContainsPoint: point below rect");

    // Point on edge (should be inside)
    const pointOnEdge = vector2Ref(10, 50);
    const edgeResult = rectContainsPoint(containerRect, pointOnEdge);
    TestRunner.assert(!!getValue(edgeResult), "rectContainsPoint: point on left edge");

    // Point at corner (should be inside)
    const pointCorner = vector2Ref(10, 10);
    const cornerResult = rectContainsPoint(containerRect, pointCorner);
    TestRunner.assert(!!getValue(cornerResult), "rectContainsPoint: point at top-left corner");

    // =========================================================================
    // Section 2.4: Rectangle Intersection
    // =========================================================================
    TestRunner.setCategory("2.4 Rectangle Intersection");

    const rectA = createRect2D(0, 0, 100, 100);
    const rectB = createRect2D(50, 50, 100, 100);
    const rectC = createRect2D(200, 200, 50, 50);
    const rectD = createRect2D(100, 0, 50, 100); // Adjacent to rectA

    // Overlapping rectangles
    // Note: rectIntersects may return a ref or raw boolean depending on operated() behavior
    const overlapResult = rectIntersects(rectA, rectB);
    TestRunner.assert(!!getValue(overlapResult), "rectIntersects: overlapping rectangles");

    // Non-overlapping rectangles
    const noOverlapResult = rectIntersects(rectA, rectC);
    TestRunner.assert(!getValue(noOverlapResult), "rectIntersects: non-overlapping rectangles");

    // Adjacent rectangles (touching but not overlapping)
    const adjacentResult = rectIntersects(rectA, rectD);
    TestRunner.assert(!!getValue(adjacentResult), "rectIntersects: adjacent rectangles (edge touching)");

    // Same rectangle
    const selfIntersect = rectIntersects(rectA, rectA);
    TestRunner.assert(!!getValue(selfIntersect), "rectIntersects: rectangle with itself");

    // =========================================================================
    // Section 2.5: Point Clamping
    // =========================================================================
    TestRunner.setCategory("2.5 Point Clamping");

    const clampRect = createRect2D(10, 10, 80, 80); // 10-90 in both axes

    // Point inside stays unchanged
    const insideClamp = vector2Ref(50, 50);
    const clampedInside = clampPointToRect(insideClamp, clampRect);
    TestRunner.assertEqual(clampedInside.x.value, 50, "clampPointToRect: inside point unchanged x");
    TestRunner.assertEqual(clampedInside.y.value, 50, "clampPointToRect: inside point unchanged y");

    // Point outside left
    const outsideLeft = vector2Ref(0, 50);
    const clampedLeft = clampPointToRect(outsideLeft, clampRect);
    TestRunner.assertEqual(clampedLeft.x.value, 10, "clampPointToRect: outside left clamped");

    // Point outside right
    const outsideRight = vector2Ref(100, 50);
    const clampedRight = clampPointToRect(outsideRight, clampRect);
    TestRunner.assertEqual(clampedRight.x.value, 90, "clampPointToRect: outside right clamped");

    // Point outside corner
    const outsideCorner = vector2Ref(0, 0);
    const clampedCorner = clampPointToRect(outsideCorner, clampRect);
    TestRunner.assertEqual(clampedCorner.x.value, 10, "clampPointToRect: corner clamped x");
    TestRunner.assertEqual(clampedCorner.y.value, 10, "clampPointToRect: corner clamped y");

    // =========================================================================
    // Section 2.6: Point to Rectangle Distance
    // =========================================================================
    TestRunner.setCategory("2.6 Point-Rect Distance");

    const distRect = createRect2D(10, 10, 80, 80);

    // Point inside (distance = 0)
    const insideDist = vector2Ref(50, 50);
    const insideDistance = pointToRectDistance(insideDist, distRect);
    TestRunner.assertEqual(insideDistance.value, 0, "pointToRectDistance: inside point = 0");

    // Point directly left (horizontal distance)
    const leftDist = vector2Ref(0, 50);
    const leftDistance = pointToRectDistance(leftDist, distRect);
    TestRunner.assertEqual(leftDistance.value, 10, "pointToRectDistance: 10 units left");

    // Point at corner (diagonal distance)
    const cornerDist = vector2Ref(0, 0);
    const cornerDistance = pointToRectDistance(cornerDist, distRect);
    const expectedDiag = Math.sqrt(10 * 10 + 10 * 10); // √200 ≈ 14.14
    TestRunner.assertApprox(cornerDistance.value, expectedDiag, 0.01, "pointToRectDistance: diagonal corner");

    // =========================================================================
    // Section 2.7: Rectangle Union
    // =========================================================================
    TestRunner.setCategory("2.7 Rectangle Union");

    const unionA = createRect2D(0, 0, 50, 50);
    const unionB = createRect2D(25, 25, 50, 50);
    const union = rectUnion(unionA, unionB);

    TestRunner.assertEqual(union.position.x.value, 0, "rectUnion position x (min)");
    TestRunner.assertEqual(union.position.y.value, 0, "rectUnion position y (min)");
    TestRunner.assertEqual(union.size.x.value, 75, "rectUnion width (max right - min left)");
    TestRunner.assertEqual(union.size.y.value, 75, "rectUnion height (max bottom - min top)");

    // Separate rectangles
    const sepA = createRect2D(0, 0, 10, 10);
    const sepB = createRect2D(90, 90, 10, 10);
    const sepUnion = rectUnion(sepA, sepB);
    TestRunner.assertEqual(sepUnion.size.x.value, 100, "rectUnion of separate rects width");
    TestRunner.assertEqual(sepUnion.size.y.value, 100, "rectUnion of separate rects height");

    // =========================================================================
    // Section 2.8: Scale Around Center
    // =========================================================================
    TestRunner.setCategory("2.8 Scale Around Center");

    const scaleRect = createRect2D(25, 25, 50, 50); // Center at (50, 50)
    const scaled = scaleRectAroundCenter(scaleRect, numberRef(2));

    // Double size should: new width=100, new height=100
    // Center stays at 50,50, so position becomes 0,0
    TestRunner.assertEqual(scaled.size.x.value, 100, "scaleRectAroundCenter doubled width");
    TestRunner.assertEqual(scaled.size.y.value, 100, "scaleRectAroundCenter doubled height");
    TestRunner.assertEqual(scaled.position.x.value, 0, "scaleRectAroundCenter repositioned x");
    TestRunner.assertEqual(scaled.position.y.value, 0, "scaleRectAroundCenter repositioned y");

    // Half size
    const halfScale = scaleRectAroundCenter(scaleRect, numberRef(0.5));
    TestRunner.assertEqual(halfScale.size.x.value, 25, "scaleRectAroundCenter halved width");

    // =========================================================================
    // Section 2.9: Aspect Ratio Constraints
    // =========================================================================
    TestRunner.setCategory("2.9 Aspect Ratio");

    // Wide rectangle constrained to 1:1 (fit mode)
    const wideRect = createRect2D(0, 0, 200, 100);
    const constrained = constrainRectAspectRatio(wideRect, numberRef(1), "fit");

    // In fit mode, the result should fit within original bounds
    // A 200x100 rect with 1:1 ratio should become based on height constraint
    // Note: This function returns a reactive result, test initial values

    // =========================================================================
    // Section 2.10: UI Control Helpers
    // =========================================================================
    TestRunner.setCategory("2.10 UI Control Helpers");

    // Slider thumb position
    const sliderValue = numberRef(50);
    const sliderMin = numberRef(0);
    const sliderMax = numberRef(100);
    const trackSize = numberRef(200);

    const thumbPos = sliderThumbPosition(sliderValue, sliderMin, sliderMax, trackSize);
    TestRunner.assertEqual(thumbPos.value, 100, "sliderThumbPosition: 50% = 100px on 200px track");

    // Edge cases
    const thumbPosMin = sliderThumbPosition(numberRef(0), sliderMin, sliderMax, trackSize);
    TestRunner.assertEqual(thumbPosMin.value, 0, "sliderThumbPosition: 0% = 0px");

    const thumbPosMax = sliderThumbPosition(numberRef(100), sliderMin, sliderMax, trackSize);
    TestRunner.assertEqual(thumbPosMax.value, 200, "sliderThumbPosition: 100% = 200px");

    // Scrollbar metrics
    const contentSize = numberRef(1000);
    const containerSize = numberRef(200);
    const scrollPosition = numberRef(0);

    const scrollMetrics = scrollbarMetrics(contentSize, containerSize, scrollPosition);
    TestRunner.assertEqual(scrollMetrics.thumbSize.value, 40, "scrollbarMetrics thumb size (200/1000 * 200)");
    TestRunner.assertEqual(scrollMetrics.thumbPosition.value, 0, "scrollbarMetrics thumb position at 0");

    // Screen to control value
    const controlRect = createRect2D(100, 100, 200, 50);
    const screenPos = numberRef(200); // Middle of control
    const normalizedValue = screenToControlValue(screenPos, controlRect, "x");
    TestRunner.assertEqual(normalizedValue.value, 0.5, "screenToControlValue: middle = 0.5");

    // Clamping at edges
    const belowControl = screenToControlValue(numberRef(50), controlRect, "x");
    TestRunner.assertEqual(belowControl.value, 0, "screenToControlValue: below clamped to 0");

    const aboveControl = screenToControlValue(numberRef(400), controlRect, "x");
    TestRunner.assertEqual(aboveControl.value, 1, "screenToControlValue: above clamped to 1");

    // =========================================================================
    // Section 2.11: Easing Functions
    // =========================================================================
    TestRunner.setCategory("2.11 Easing Functions");

    // Ease in-out cubic
    const easeStart = easeInOutCubic(numberRef(0));
    TestRunner.assertEqual(easeStart.value, 0, "easeInOutCubic(0) = 0");

    const easeEnd = easeInOutCubic(numberRef(1));
    TestRunner.assertEqual(easeEnd.value, 1, "easeInOutCubic(1) = 1");

    const easeMid = easeInOutCubic(numberRef(0.5));
    TestRunner.assertEqual(easeMid.value, 0.5, "easeInOutCubic(0.5) = 0.5");

    // Ease out bounce
    const bounceEnd = easeOutBounce(numberRef(1));
    TestRunner.assertApprox(bounceEnd.value, 1, 0.01, "easeOutBounce(1) ≈ 1");

    const bounceStart = easeOutBounce(numberRef(0));
    TestRunner.assertEqual(bounceStart.value, 0, "easeOutBounce(0) = 0");

    // =========================================================================
    // Section 2.12: Momentum and Scroll Physics
    // =========================================================================
    TestRunner.setCategory("2.12 Momentum Physics");

    // Momentum decay
    const velocity = numberRef(100);
    const decayedVelocity = momentumScroll(velocity, numberRef(0.95));
    TestRunner.assertEqual(decayedVelocity.value, 95, "momentumScroll: 100 * 0.95 = 95");

    // Velocity below threshold stops
    const tinyVelocity = numberRef(0.005);
    const stoppedVelocity = momentumScroll(tinyVelocity, numberRef(0.95), numberRef(0.01));
    TestRunner.assertEqual(stoppedVelocity.value, 0, "momentumScroll: below threshold = 0");

    // Scroll bounds with bounce
    const normalScroll = scrollBoundsWithBounce(numberRef(100), numberRef(500), numberRef(200));
    TestRunner.assertEqual(normalScroll.value, 100, "scrollBoundsWithBounce: normal position unchanged");

    // Over-scroll at start (negative)
    const overScrollStart = scrollBoundsWithBounce(numberRef(-30), numberRef(500), numberRef(200));
    TestRunner.assert(overScrollStart.value > -30 && overScrollStart.value < 0, "scrollBoundsWithBounce: bounce at start");

    // Over-scroll at end
    const maxScroll = 500 - 200; // 300
    const overScrollEnd = scrollBoundsWithBounce(numberRef(350), numberRef(500), numberRef(200));
    TestRunner.assert(overScrollEnd.value > 300 && overScrollEnd.value < 350, "scrollBoundsWithBounce: bounce at end");

    // Smooth value transition
    const current = numberRef(0);
    const target = numberRef(100);
    const smoothed = smoothValueTransition(current, target, numberRef(0.5));
    TestRunner.assertEqual(smoothed.value, 50, "smoothValueTransition: 0 → 100 with 0.5 smoothing = 50");
}
