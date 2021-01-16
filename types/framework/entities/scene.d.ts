/**
 * The collection of Scene entities
 */
declare class Scenes extends EntityCollection<Scene> {

  /** @override */
  get entity(): string

  /**
   * Return a reference to the Scene which is currently active
   * @return {Scene}
   */
  get active(): Scene

  /**
   * Return a reference to the Scene which is currently viewed
   * @return {Scene}
   */
  get viewed(): Scene

  /* -------------------------------------------- */
  /*  Socket Listeners and Handlers               */
  /* -------------------------------------------- */

  /** @override */
  static socketListeners(socket: SocketIOClient.Socket): void

  /**
   * Augment the standard modifyDocument listener to flush fog exploration
   * @private
   */
  static _resetFog(response: {
    scene: Scene
    reset: boolean
  }): Promise<Canvas>

  /**
   * Handle pre-loading the art assets for a Scene
   * @param {string} sceneId    The Scene id to begin loading
   * @param {boolean} push      Trigger other connected clients to also pre-load Scene resources
   */
  preload(sceneId: string, push?: boolean): Promise<void>

  /**
   * Handle requests pulling the current User to a specific Scene
   * @param {string} sceneId
   * @private
   */
  static _pullToScene(sceneId: string): void

  /** @override */
  fromCompendium(data: Scene.Data): Scene.Data
}

/**
 * The Scene entity
 */
declare class Scene<D extends Scene.Data = Scene.Data> extends Entity<D> {
  /**
   * Track whether the scene is the active view
   * @type {boolean}
   */
  _view: boolean

  /**
   * Track the viewed position of each scene (while in memory only, not persisted)
   * When switching back to a previously viewed scene, we can automatically pan to the previous position.
   * Object with keys: x, y, scale
   * @type {Object}
   */
  viewPosition: {
    x: number
    y: number
    scale: number
  }

  /** @extends {EntityCollection.config} */
  static get config (): Entity.Config

  /** @override */
  prepareData (): D

  /** @override */
  prepareEmbeddedEntities (): void

  /* -------------------------------------------- */
  /*  Properties                                  */
  /* -------------------------------------------- */

  /**
   * A convenience accessor for the background image of the Scene
   * @type {string}
   */
  get img (): string

  /**
   * A convenience accessor for whether the Scene is currently active
   * @type {boolean}
   */
  get active (): boolean

  /**
   * A convenience accessor for whether the Scene is currently viewed
   * @type {boolean}
   */
  get isView (): boolean

  /**
   * A reference to the JournalEntry entity associated with this Scene, or null
   * @return {JournalEntry|null}
   */
  get journal (): JournalEntry | null

  /**
   * A reference to the Playlist entity for this Scene, or null
   * @type {Playlist|null}
   */
  get playlist (): Playlist | null

  /**
   * Set this scene as the current view
   * @return {Promise<void>}
   */
  view (): Promise<void>

  /**
   * Set this scene as currently active
   * @return {Promise<Scene>}  A Promise which resolves to the current scene once it has been successfully activated
   */
  activate (): Promise<this>

  /* -------------------------------------------- */
  /*  Socket Listeners and Handlers               */
  /* -------------------------------------------- */

  /** @override */
  clone (createData?: D, options?: Entity.CreateOptions): Promise<Scene<D>>

  /** @override */
  static create (data: Scene.Data, options?: Entity.CreateOptions): Promise<Scene<Scene.Data>>

  /** @override */
  update (data: D, options: Entity.UpdateOptions): Promise<this>

  /** @override */
  _onCreate (data: D, options: any, userId: string): void

  /** @override */
  _onUpdate (data: D, options: Entity.UpdateOptions, userId: string): void

  /** @override */
  _onDelete (options: Entity.DeleteOptions, userId: string): void

  /**
   * Handle Scene activation workflow if the active state is changed to true
   * @private
   */
  _onActivate (active: boolean): void

  /** @override */
  _onCreateEmbeddedEntity (embeddedName: string, child: any, options: any, userId: string): void

  /** @override */
  _onUpdateEmbeddedEntity (embeddedName: string, child: any, updateData: any, options: any, userId: string): void

  /** @override */
  _onDeleteEmbeddedEntity (embeddedName: string, child: any, options: any, userId: string): void

  /** @override */
  _onModifyEmbeddedEntity (embeddedName: string, changes: any[], options: any, userId: string, context?: any): void

  /* -------------------------------------------- */
  /*  History Storage Handlers                    */
  /* -------------------------------------------- */

  /** @override */
  static _handleCreateEmbeddedEntity ({ request, result, userId }: any): any[]

  /** @override */
  static _handleUpdateEmbeddedEntity ({ request, result, userId }: any): any[]

  /** @override */
  static _handleDeleteEmbeddedEntity ({ request, result, userId }: any): any[]

  /* -------------------------------------------- */
  /*  Importing and Exporting                     */
  /* -------------------------------------------- */

  /** @override */
  toCompendium (): Promise<any>

  /**
   * Create a 300px by 100px thumbnail image for this scene background
   * @param {string} [string|null]  A background image to use for thumbnail creation, otherwise the current scene
   *                          background is used.
   * @param {number} [width]        The desired thumbnail width. Default is 300px
   * @param {number} [height]       The desired thumbnail height. Default is 100px;
   * @return {Promise<object>}      The created thumbnail data.
   */
  createThumbnail ({ img, width, height }: {
    img: string | null
    width?: number
    height?: number
  }): Promise<ImageHelper.ThumbnailReturn>
}

declare namespace Scene {
  interface Data extends Entity.Data {
    active?: boolean
    backgroundColor?: string
    darkness?: number
    description?: string
    fogExploration?: boolean
    globalLight?: boolean
    globalLightThreshold?: number
    grid?: number
    gridAlpha?: number
    gridColor?: string
    gridDistance?: number
    gridType?: number // There's probably an enum TODO
    gridUnits?: string
    height?: number
    img?: string
    initial?: {
      x: number
      y: number
      scale: number
    }
    journal?: string
    navName?: string
    navOrder?: number
    navigation?: boolean
    padding?: number
    playlist?: string
    shiftX?: number
    shiftY?: number
    size?: number
    sort?: number
    tokenVision?: boolean
    weather?: string
    width?: number

    // EmbeddedEntities, arrays of the type of the data param of these
    drawings?: any[] // TODO Drawing class (PlaceableObject)
    lights?: any[] // TODO AmbientLight class (PlaceableObject)
    notes?: any[] // TODO Note class (PlaceableObject)
    sounds?: any[] // TODO AmbientSound class (PlaceableObject)
    templates?: any[] // TODO MeasuredTemplate class (PlaceableObject)
    tiles?: any[] // TODO Tile class (PlaceableObject)
    tokens?: any[] // Token.data
    walls?: any[] // Wall.data
  }
}
