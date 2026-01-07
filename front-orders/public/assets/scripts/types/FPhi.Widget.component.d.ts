export interface WidgetCheckCapabilities {
  camera: boolean;
  wasm: boolean;
  memory: boolean;
  browser: boolean;
}

export class WidgetComponent extends HTMLElement {
  // #region Widget System Path's

  /**
   * React specific
   */
  public ref: any;
  public style: any;

  /**
   * Path to base bundle path
   */
  public bundlePath: string;
  public resourcesPath: string;
  public graphPath: string;

  // #endregion

  // #region Widget Miscellaneous Parameters

  public timeout: number;
  public language: string;
  public dpilist: string;
  public tutorial: boolean;
  public interactible: boolean;
  public logImages: boolean;
  public stabilizationStage: boolean;

  // #endregion

  // #region Widget Camera Parameters

  public cameraWidth: number;
  public cameraHeight: number;
  public cameraRotation: number;
  public cameraType: number;
  public cameraSwitchButton: boolean;
  public cameraId: string;

  // #endregion

  // #region Widget Liveness Parameters

  public livenessMode: number;
  public livenessPrecision: number;

  /**
   * @deprecated
   */
  public livenessMoveInitialError: number;

  /**
   * @deprecated
   */
  public livenessMoveInfoTime: number;

  // #endregion

  // #region Widget Crop Parameters

  public cropFactor: number;
  public cropImage: boolean;

  // #endregion

  // #region Widget Expiration time for different modes

  public authenticateTime: number;

  // #endregion

  // #region Widget Image and Template Parameters

  public imageFormat: string;
  public imageQuality: number;
  public templateFormat: string;

  // #endregion

  // #region Widget Video Record Parameters

  public videoRecord: boolean;
  public videoRecordRate: number;
  public videoRecordScale: number;
  public videoRecordType: number;

  // #endregion

  // #region Widget Debug Parameters

  public showLog: boolean;
  public debugMode: boolean;

  // #endregion

  // #region Widget Protected Parameters

  public externalCamera: boolean;
  public epheremalKey: string;

  // #endregion

  // #region Face Tracking

  public faceTracking: boolean;

  // #endregion

  // #region Widget Web Accessibility Settings

  /**
   * @deprecated
   */
  public accessibility: boolean;

  /**
   * @deprecated
   */
  public accessibleElements: Array<string>;

  // #endregion

  /**
   * Events definition section
   */
  public onModuleLoaded: Event;
  public onStabilizing: Event;
  public onExtractionFinish: Event;
  public onUserCancel: Event;
  public onExceptionCaptured: Event;
  public onLivenessError: Event;
  public onLivenessErrorButtonClick: Event;
  public onExtractionTimeout: Event;
  public onTimeoutErrorButtonClick: Event;
  public onTrackStatus: Event;
  public onAccessibilityStatus: Event;

  public static attributes: any;

  public addWidgetEventListener(
    type: string,
    listener: (event: any) => {}
  ): void;
  public mountExternalCamera(cameraStreamInput: MediaStream): void;
  public static checkCapabilities(): Promise<WidgetCheckCapabilities>;

  public static generateTemplateRawFromByteArray(
    bundlePath: string,
    img: any,
    onFinish: (event: any) => void
  ): void;
  public static generateTemplateRawFromByteArray(
    config: {},
    img: any,
    onFinish: (event: any) => void
  ): void;

  public generateTemplateRawFromByteArray(
    bundlePath: string,
    img: any,
    onFinish: (event: any) => void
  ): void;
  public generateTemplateRawFromByteArray(
    config: {},
    img: any,
    onFinish: (event: any) => void
  ): void;
}
