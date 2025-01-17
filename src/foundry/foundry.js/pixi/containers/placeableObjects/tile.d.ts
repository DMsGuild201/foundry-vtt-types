import type { ConfiguredDocumentClass, ConfiguredObjectClassForName } from '../../../../../types/helperTypes';
import { DocumentModificationOptions } from '../../../../common/abstract/document.mjs';
import type { TileDataConstructorData } from '../../../../common/data/data.mjs/tileData';

declare global {
  /**
   * A Tile is an implementation of PlaceableObject which represents a static piece of artwork or prop within the Scene.
   * Tiles are drawn inside a {@link BackgroundLayer} container.
   *
   * @see {@link TileDocument}
   * @see {@link BackgroundLayer}
   * @see {@link TileSheet}
   * @see {@link TileHUD}
   */
  class Tile extends PlaceableObject<InstanceType<ConfiguredDocumentClass<typeof TileDocument>>> {
    /**
     * @remarks Not used for `Tile`
     */
    controlIcon: null;

    /**
     * The Tile border frame
     * @defaultValue `undefined`
     */
    frame: PIXI.Container | undefined;

    /**
     * The primary tile image texture
     * @defaultValue `undefined`
     */
    texture: PIXI.Texture | undefined;

    /**
     * The Tile image sprite
     * @defaultValue `undefined`
     */
    tile: PIXI.Sprite | undefined;

    /**
     * A Tile background which is displayed if no valid image texture is present
     * @defaultValue `undefined`
     */
    bg: PIXI.Graphics | undefined;

    /**
     * A cached mapping of non-transparent pixels
     * @defaultValue `undefined`
     * @internal
     */
    protected _alphaMap:
      | {
          minX: number;
          minY: number;
          maxX: number;
          maxY: number;
          pixels: Uint8Array | undefined;
          texture: PIXI.RenderTexture | undefined;
        }
      | undefined;

    /**
     * A flag which tracks whether the overhead tile is currently in an occluded state
     * @defaultValue `false`
     */
    occluded: boolean;

    /** @override */
    static embeddedName: 'Tile';

    /**
     * Get the native aspect ratio of the base texture for the Tile sprite
     */
    get aspectRatio(): number;

    /**
     * The HTML source element for the primary Tile texture
     */
    get sourceElement(): HTMLImageElement | HTMLVideoElement | undefined;

    /**
     * Does this Tile depict an animated video texture?
     */
    get isVideo(): boolean;

    /**
     * Is this tile a roof
     */
    get isRoof(): boolean;

    /** @override */
    draw(): Promise<this>;

    /** @override */
    refresh(): this;

    /**
     * Refresh the display of the Tile border
     * @internal
     */
    protected _refreshBorder(b: Rectangle): void;

    /**
     * Refresh the display of the Tile resizing handle
     * @internal
     */
    protected _refreshHandle(b: Rectangle): void;

    /**
     * Play video for this Tile (if applicable).
     * @param playing - Should the Tile video be playing?
     * @param options - Additional options for modifying video playback
     *                  (default: `{}`)
     */
    play(playing: boolean, options?: Partial<Tile.PlayOptions>): void;

    /**
     * Update the occlusion rendering for this overhead Tile for a given controlled Token.
     * @param tokens - The set of currently controlled Token objects
     */
    updateOcclusion(tokens: Array<InstanceType<ConfiguredObjectClassForName<'Token'>>>): void;

    /**
     * Test whether a specific Token occludes this overhead tile.
     * Occlusion is tested against 9 points, the center, the four corners-, and the four cardinal directions
     * @param token   - The Token to test
     * @param options - Additional options that affect testing
     * @returns Is the Token occluded by the Tile?
     */
    testOcclusion(
      token: InstanceType<ConfiguredObjectClassForName<'Token'>>,
      options?: Partial<Tile.OcclusionOptions>
    ): boolean;

    /**
     * Test whether the Tile pixel data contains a specific point in canvas space
     */
    containsPixel(x: number, y: number): boolean;

    /**
     * Draw a sprite for the Roof which can be deducted from the fog exploration container
     */
    getRoofSprite(): PIXI.Sprite | undefined;

    /**
     * Swap a Tile from the background to the foreground - or vice versa
     * TODO: Refactor to private _onSwapLayer
     */
    swapLayer(): void;

    /**
     * Created a cached mapping of pixel alpha for this Tile.
     * Cache the bounding box of non-transparent pixels for the un-rotated shape.
     * Store an array of booleans for whether each pixel has a non-transparent value.
     * @param options - Options which customize the return value
     * @internal
     */
    protected _createAlphaMap(options: Partial<Tile.AlphaMapOptions>): Exclude<Tile['_alphaMap'], undefined>;

    /**
     * Compute the alpha-based bounding box for the tile, including an angle of rotation.
     * @internal
     */
    protected _getAlphaBounds(): NormalizedRectangle;

    /**
     * Create the filter instance used to reverse-mask overhead tiles using radial or vision-based occlusion.
     * @internal
     */
    protected _createOcclusionFilter(): AbstractBaseMaskFilter;

    /** @override */
    protected _onUpdate(
      changed: DeepPartial<foundry.data.TileData['_source']>,
      options?: DocumentModificationOptions,
      userId?: string
    ): Promise<this> | void;

    /** @override */
    protected _onDelete(options: DocumentModificationOptions, userId: string): void;

    /** @override */
    activateListeners(): void;

    /** @override */
    protected _canConfigure(user: User, event?: any): boolean;

    /** @override */
    protected _onClickLeft2(event: PIXI.InteractionEvent): void;

    /** @override */
    protected _onDragLeftStart(event: PIXI.InteractionEvent): void;

    /** @override */
    protected _onDragLeftMove(event: PIXI.InteractionEvent): void;

    /** @override */
    protected _onDragLeftDrop(event: PIXI.InteractionEvent): Promise<unknown>;

    /** @override */
    protected _onDragLeftCancel(event: MouseEvent): void;

    /**
     * Handle mouse-over event on a control handle
     * @param event - The mouseover event
     */
    protected _onHandleHoverIn(event: PIXI.InteractionEvent): void;

    /**
     * Handle mouse-out event on a control handle
     * @param event - The mouseout event
     */
    protected _onHandleHoverOut(event: PIXI.InteractionEvent): void;

    /**
     * When we start a drag event - create a preview copy of the Tile for re-positioning
     * @param event - The mousedown event
     */
    protected _onHandleMouseDown(event: PIXI.InteractionEvent): void;

    /**
     * Handle the beginning of a drag event on a resize handle
     * @param event - The mousedown event
     */
    protected _onHandleDragStart(event: PIXI.InteractionEvent): void;

    /**
     * Handle mousemove while dragging a tile scale handler
     * @param event - The mousemove event
     */
    protected _onHandleDragMove(event: PIXI.InteractionEvent): void;

    /**
     * Handle mouseup after dragging a tile scale handler
     * @param event - The mouseup event
     */
    protected _onHandleDragDrop(event: PIXI.InteractionEvent): Promise<this>;

    /**
     * Get resized Tile dimensions
     * @internal
     */
    protected _getResizedDimensions(event: MouseEvent, origin: Point, destination: Point): NormalizedRectangle;

    /**
     * Handle cancellation of a drag event for one of the resizing handles
     */
    protected _onHandleDragCancel(): void;

    /**
     * Create a preview tile with a background texture instead of an image
     */
    static createPreview(data: TileDataConstructorData): Tile;
  }

  namespace Tile {
    interface PlayOptions {
      /** Should the video loop? */
      loop: boolean;
      /** A specific timestamp between 0 and the video duration to begin playback */
      offset: number;
      /** Desired volume level of the video's audio channel (if any) */
      volume: number;
    }

    interface OcclusionOptions {
      /**
       * Test corners of the hit-box in addition to the token center?
       * @defaultValue `true`
       */
      corners: boolean;
    }

    interface AlphaMapOptions {
      /**
       * Keep the Uint8Array of pixel alphas?
       * @defaultValue `false`
       */
      keepPixels: boolean;

      /**
       * Keep the pure white RenderTexture?
       * @defaultValue `false`
       */
      keepTexture: boolean;
    }
  }
}
