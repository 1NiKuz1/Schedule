import { describe, it, expect, beforeEach } from "vitest";
import { LinkedEntity } from "../../../model/structures";

class TestEntity extends LinkedEntity<TestEntity> {
    public id: string;
    constructor(id: string) {
        super();
        this.id = id;
    }
}

describe("Entities/EventLayout/model/structures/LinkedEntity", () => {
    let entityA: TestEntity;
    let entityB: TestEntity;
    let entityC: TestEntity;

    beforeEach(() => {
        entityA = new TestEntity("A");
        entityB = new TestEntity("B");
        entityC = new TestEntity("C");
    });

    describe("addNext", () => {
        it("Must establish two-way communication", () => {
            entityA.addNext(entityB);

            expect(entityA.next).toContain(entityB);
            expect(entityB.prev).toContain(entityA);
            expect(entityA.next.length).toBe(1);
            expect(entityB.prev.length).toBe(1);
        });

        it("Should not add yourself", () => {
            entityA.addNext(entityA);

            expect(entityA.next).not.toContain(entityA);
            expect(entityA.next.length).toBe(0);
        });

        it("Must not duplicate existing connections", () => {
            entityA.addNext(entityB);
            entityA.addNext(entityB);

            expect(entityA.next.length).toBe(1);
            expect(entityB.prev.length).toBe(1);
        });
    });

    describe("addPrev", () => {
        it("Must establish two-way communication", () => {
            entityB.addPrev(entityA);

            expect(entityB.prev).toContain(entityA);
            expect(entityA.next).toContain(entityB);
            expect(entityB.prev.length).toBe(1);
            expect(entityA.next.length).toBe(1);
        });

        it("He shouldn't add himself", () => {
            entityA.addPrev(entityA);

            expect(entityA.prev).not.toContain(entityA);
            expect(entityA.prev.length).toBe(0);
        });

        it("Must not duplicate existing connections", () => {
            entityA.addPrev(entityB);
            entityA.addPrev(entityB);

            expect(entityA.prev.length).toBe(1);
            expect(entityB.next.length).toBe(1);
        });
    });

    describe("removeNext", () => {
        it("Deletes the connection correctly in both directions", () => {
            entityA.addNext(entityB);
            entityA.removeNext(entityB);

            expect(entityA.next).not.toContain(entityB);
            expect(entityB.prev).not.toContain(entityA);
            expect(entityA.next.length).toBe(0);
            expect(entityB.prev.length).toBe(0);
        });

        it("Does not crash when deleting a non-existent connection", () => {
            expect(() => entityA.removeNext(entityB)).not.toThrow();
        });

        it("Deletes only the specified link", () => {
            entityA.addNext(entityB);
            entityA.addNext(entityC);
            entityA.removeNext(entityB);

            expect(entityA.next).not.toContain(entityB);
            expect(entityA.next).toContain(entityC);
            expect(entityB.prev.length).toBe(0);
            expect(entityC.prev.length).toBe(1);
        });
    });

    describe("removePrev", () => {
        it("Deletes the connection correctly in both directions", () => {
            entityB.addPrev(entityA);
            entityB.removePrev(entityA);

            expect(entityB.prev).not.toContain(entityA);
            expect(entityA.next).not.toContain(entityB);
            expect(entityB.prev.length).toBe(0);
            expect(entityA.next.length).toBe(0);
        });

        it("Does not crash when deleting a non-existent connection", () => {
            expect(() => entityB.removePrev(entityA)).not.toThrow();
        });

        it("Deletes only the specified link", () => {
            entityA.addPrev(entityB);
            entityA.addPrev(entityC);
            entityA.removePrev(entityB);

            expect(entityA.prev).not.toContain(entityB);
            expect(entityA.prev).toContain(entityC);
            expect(entityB.next.length).toBe(0);
            expect(entityC.next.length).toBe(1);
        });
    });

    describe("Complex connections", () => {
        it("Handles multiple links correctly", () => {
            // A -> B -> C
            entityA.addNext(entityB);
            entityB.addNext(entityC);

            expect(entityA.next).toEqual([entityB]);
            expect(entityB.next).toEqual([entityC]);
            expect(entityC.next).toEqual([]);

            expect(entityA.prev).toEqual([]);
            expect(entityB.prev).toEqual([entityA]);
            expect(entityC.prev).toEqual([entityB]);
        });

        it("Handles deletion in the middle of the chain correctly", () => {
            // Initial state: A -> B -> C
            entityA.addNext(entityB);
            entityB.addNext(entityC);

            // Removing B from the links of A
            entityA.removeNext(entityB);

            expect(entityA.next).toEqual([]);
            expect(entityB.prev).toEqual([]);
            expect(entityB.next).toEqual([entityC]); // The B -> C relationship is preserved
            expect(entityC.prev).toEqual([entityB]);
        });
    });
});
