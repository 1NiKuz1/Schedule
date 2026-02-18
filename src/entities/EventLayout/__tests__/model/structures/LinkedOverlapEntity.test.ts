import { describe, it, expect, beforeEach } from "vitest";
import { LinkedOverlapEntity } from "../../../model/structures";

class TestEntity extends LinkedOverlapEntity<TestEntity> {
    public id: string;
    constructor(id: string) {
        super();
        this.id = id;
    }
}

describe("Entities/EventLayout/model/structures/LinkedOverlapEntity", () => {
    let entityA: TestEntity;
    let entityB: TestEntity;
    let entityC: TestEntity;

    beforeEach(() => {
        entityA = new TestEntity("A");
        entityB = new TestEntity("B");
        entityC = new TestEntity("C");
    });

    describe("addOverlap", () => {
        it("Must establish two-way overlap communication", () => {
            entityA.addOverlap(entityB);

            expect(entityA.overlaps).toContain(entityB);
            expect(entityB.overlaps).toContain(entityA);
            expect(entityA.overlaps.length).toBe(1);
            expect(entityB.overlaps.length).toBe(1);
        });

        it("Should not add yourself", () => {
            entityA.addOverlap(entityA);

            expect(entityA.overlaps).not.toContain(entityA);
            expect(entityA.overlaps.length).toBe(0);
        });

        it("Should not duplicate existing overlap connections", () => {
            entityA.addOverlap(entityB);
            entityA.addOverlap(entityB);

            expect(entityA.overlaps.length).toBe(1);
            expect(entityB.overlaps.length).toBe(1);
        });

        it("Must allow multiple overlaps", () => {
            entityA.addOverlap(entityB);
            entityA.addOverlap(entityC);

            expect(entityA.overlaps).toEqual([entityB, entityC]);
            expect(entityB.overlaps).toContain(entityA);
            expect(entityC.overlaps).toContain(entityA);
        });
    });

    describe("removeOverlap", () => {
        it("Should remove the overlap link in both directions", () => {
            entityA.addOverlap(entityB);
            entityA.removeOverlap(entityB);

            expect(entityA.overlaps).not.toContain(entityB);
            expect(entityB.overlaps).not.toContain(entityA);
            expect(entityA.overlaps.length).toBe(0);
            expect(entityB.overlaps.length).toBe(0);
        });

        it("It should not crash when deleting a non-existent connection", () => {
            expect(() => entityA.removeOverlap(entityB)).not.toThrow();
        });

        it("Must delete only the specified link", () => {
            entityA.addOverlap(entityB);
            entityA.addOverlap(entityC);
            entityA.removeOverlap(entityB);

            expect(entityA.overlaps).not.toContain(entityB);
            expect(entityA.overlaps).toContain(entityC);
            expect(entityB.overlaps).not.toContain(entityA);
            expect(entityC.overlaps).toContain(entityA);
        });
    });

    describe("A combination of connections", () => {
        it("Must independently manage next, prev, and overlaps", () => {
            // We establish all types of connections
            entityA.addNext(entityB);
            entityA.addPrev(entityC);
            entityA.addOverlap(entityB);

            expect(entityA.next).toContain(entityB);
            expect(entityA.prev).toContain(entityC);
            expect(entityA.overlaps).toContain(entityB);

            expect(entityB.prev).toContain(entityA);
            expect(entityC.next).toContain(entityA);
            expect(entityB.overlaps).toContain(entityA);

            // Deleting one connection
            entityA.removeOverlap(entityB);

            // We check that only overlaps are removed.
            expect(entityA.overlaps).not.toContain(entityB);
            expect(entityB.overlaps).not.toContain(entityA);
            expect(entityA.next).toContain(entityB);
            expect(entityB.prev).toContain(entityA);
        });

        it("Must handle complex scenarios correctly", () => {
            // A -> B (next)
            entityA.addNext(entityB);
            // A overlaps C
            entityA.addOverlap(entityC);
            // B overlaps C
            entityB.addOverlap(entityC);

            expect(entityA.next).toEqual([entityB]);
            expect(entityA.overlaps).toEqual([entityC]);
            expect(entityB.prev).toEqual([entityA]);
            expect(entityB.overlaps).toEqual([entityC]);
            expect(entityC.overlaps).toEqual([entityA, entityB]);

            // Removing the A-B connection
            entityA.removeNext(entityB);

            expect(entityA.next).toEqual([]);
            expect(entityB.prev).toEqual([]);
            expect(entityA.overlaps).toEqual([entityC]);
            expect(entityB.overlaps).toEqual([entityC]);
        });
    });
});
