# EventLayout

This component contains the **core layout engine** responsible for positioning event tiles on the timeline canvas.

### Purpose

It is utilized by two primary view templates: `ScheduleDayTemplate` and `ScheduleWeekTemplate`.

### Layout Algorithm

- Tiles are algorithmically arranged to occupy the **maximum available space** within their designated time slots.
- The engine prioritizes visual clarity and efficient use of the canvas.

### Overflow Handling

- When the available horizontal/vertical space is insufficient to display a tile without overlap, the event is **hidden from the main canvas**.
- A specialized **overflow indicator button** is rendered on the timeline at the corresponding time slot.
- This button displays a count of hidden events (e.g., "+3").
- **Clicking the button** reveals a detailed popover list of all events collapsed at that moment.

### Key Responsibility

This component decouples the complex layout logic from the visual presentation, ensuring consistent behavior across different time-scale views.

## Class diagrams

### Linked list class diagram

```mermaid
classDiagram
    note for LinkedEntity "A base class for entities<br>with bidirectional relationships"
    note for LinkedOverlapEntity "Combined Entity:<br>connections + overlaps"

    class ILinkedEntity~T~ {
        <<interface>>
        +next: T[]
        +prev: T[]
        +addNext(entity: T) boolean
        +addPrev(entity: T) boolean
        +removeNext(entity: T) void
        +removePrev(entity: T) void
        +deleteAllLinks() void
    }

    class IOverlapEntity~T~ {
        <<interface>>
        +overlaps: T[]
        +addOverlap(entity: T) boolean
        +removeOverlap(entity: T) void
        +deleteAllOverlaps() void
    }

    class ILinkedOverlapEntity~T~ {
        <<interface>>
    }

    class LinkedEntity~T~ {
        <<abstract>>
        +next: T[]
        +prev: T[]
        +addNext(entity: T) boolean
        +addPrev(entity: T) boolean
        +removeNext(entity: T) void
        +removePrev(entity: T) void
        +deleteAllLinks() void
    }

    class LinkedOverlapEntity~T~ {
        <<abstract>>
        #overlaps: T[]
        +addOverlap(entity: T) boolean
        +removeOverlap(entity: T) void
        +deleteAllOverlaps() void
    }

    ILinkedEntity <|-- ILinkedOverlapEntity
    IOverlapEntity <|-- ILinkedOverlapEntity

    LinkedEntity <|-- LinkedOverlapEntity

    ILinkedEntity <|.. LinkedEntity
    ILinkedOverlapEntity <|.. LinkedOverlapEntity
```

### Diagram of placement strategy classes

```mermaid
classDiagram
    direction TB

    class IPlacementStrategy {
        <<interface>>
        +place(tile: ITile, context: IPlacementContext) boolean
    }

    class IPlacementContext {
        <<interface>>
        +containerWidth: number
        +tilesLines: ITilesLines
        +hiddenTilesManager: IHiddenTilesManager
        +verticalOverlapsLines: ITileLine[]
    }

    class AbstractStrategy {
        <<abstract>>
    }

    class FreeSpacePlacementStrategy {
    }

    class WidestLinePlacementStrategy {
    }

    class PlacementContext {
        +containerWidth: number
        +tilesLines: ITilesLines
        +hiddenTilesManager: IHiddenTilesManager
        +verticalOverlapsLines: ITileLine[]
    }

    IPlacementStrategy <|.. AbstractStrategy
    AbstractStrategy <|-- FreeSpacePlacementStrategy
    AbstractStrategy <|-- WidestLinePlacementStrategy
    IPlacementContext <|.. PlacementContext

    PlacementContext "1" *-- "1" AbstractStrategy
```

### Core Model diagram

```mermaid
classDiagram
    direction LR

    class ITile {
        <<interface>>
        +height: number
        +width: number
        +overlaps: ITile[]
        +lineKey: IBoundaries~null~
        +hiddenKey: IVerticalBoundaries~null~
        +get boundaries() IBoundaries
        +isNeighbour(neighbour: ITile, isNext: boolean) boolean
        +fillNeighbours() void
    }

    class ITilesLines {
        <<interface>>
        +lines: Map~IBoundaries, ITileLine~
        +addLine(tile: ITile) IBoundaries
        +tileVerticalOverlapsLines(tile: ITile) ITileLine[]
        +redistributeLineTiles(line: ITileLine) void
    }

    class ITileLine {
        <<interface>>
        +boundaries: IBoundaries
        +tiles: ITile[]
        +addTile(tile: ITile) void
        +removeTile(tile: ITile) void
        +overwriteHorizontalBoundaries(boundaries: IHorizontalBoundaries) void
    }

    class IHiddenTilesManager {
        <<interface>>
        +get hiddenTilesMap() Map~IVerticalBoundaries, ITile[]~
        +get hiddenTiles() ITile[]
        +get hiddenKeys() IVerticalBoundaries[]
        +hasHiddenInRange(keyOfLine: IVerticalBoundaries) boolean
        +getTilesByKey(key: IVerticalBoundaries) ITile[]
        +registerHiddenKey(tile: ITile) IVerticalBoundaries
        +addTile(tile: ITile) boolean
        +removeTile(tile: ITile) boolean
    }

    class IHiddenTilesCalculation {
        <<interface>>
        +calcHiddenTiles(containerWidth: number) void
    }

    class Tile {
    }

    class TileLine {
    }

    class TilesLines {
    }

    class HiddenTilesManager {
    }

    class HiddenTilesCalculation {
    }

    class DistributionFreeSpace {
    }

    class EventLayoutModel {
    }

    ITile <|.. Tile
    ITileLine <|.. TileLine
    ITilesLines <|.. TilesLines
    IHiddenTilesManager <|.. HiddenTilesManager
    IHiddenTilesCalculation <|.. HiddenTilesCalculation

    LinkedOverlapEntity <|-- Tile

    TileLine o-- ITile
    TilesLines *-- ITileLine
    HiddenTilesManager o-- ITile
    HiddenTilesCalculation --o ITilesLines
    HiddenTilesCalculation --o IHiddenTilesManager
    DistributionFreeSpace --o IHiddenTilesManager
    DistributionFreeSpace --o ITileLine
    DistributionFreeSpace --o ITile
    EventLayoutModel --* IHiddenTilesManager
    EventLayoutModel --* IPlacementStrategy
    EventLayoutModel --* DistributionFreeSpace
    EventLayoutModel --* IHiddenTilesCalculation
    EventLayoutModel --* ITile
    EventLayoutModel --* ITilesLines
    EventLayoutModel --* IPlacementContext
```

### Lib Dependencies diagram

```mermaid
flowchart TD
    subgraph Model[Core classes]
        WLS[WidestLinePlacementStrategy]
        Tile
        HTC[HiddenTilesCalculation]
        DFS[DistributionFreeSpace]
        ELM[EventLayoutModel]
        TileL[TileLine]
        TilesL[TilesLines]
        HTM[HiddenTilesManager]
        FSP[FreeSpacePlacementStrategy]
    end

    subgraph Lib[Lib classes]
        BU[BoundaryUtils]
        FC[FloatComparator]
        EU[EventUtils]
        BC[ButtonWidthCalculator]
    end

    FSP --> BU
    WLS --> BU
    Tile --> BU
    TileL --> BU
    TilesL --> BU
    HTM --> BU
    HTC --> BU
    DFS --> BU
    ELM --> BU

    BU --> FC
    WLS --> FC
    Tile --> FC
    HTC --> FC
    DFS --> FC
    ELM --> FC

    BU --> EU
    HTM --> EU
    ELM --> EU

    HTC --> BC
    DFS --> BC
```
