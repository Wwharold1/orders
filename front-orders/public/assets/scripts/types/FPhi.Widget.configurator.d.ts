export class ConfigurationManager {
  container: any;
  language: string;
  dpiList: number[];
  cameraWidth: number;
  cameraHeight: number;
  cameraType: number;
  cameraSwitchButton: boolean;
  cameraRotation: number;
  cameraId: string;
  bundlePath: string;
  resourcesPath: string;
  showLog: boolean;
  onExtractionFinish: Function;
  onUserCancel: Function;
  onExceptionCaptured: Function;
  onExtractionTimeout: Function;
  onModuleLoaded: Function;
  onLivenessError: Function;
  onLivenessErrorButtonClick: Function;
  onTimeoutErrorButtonClick: Function;
  onStabilizing: Function;
  onTrackStatus: Function;
  onAccessibilityStatus: Function;
  livenessMode: number;
  tutorial: boolean;
  stabilizationStage: boolean;
  livenessPrecision: number;
  livenessMoveInitialError: number;
  livenessMoveInfoTime: number;
  interactible: boolean;
  authenticateTime: number;
  graphPath: string;
  imageFormat: string;
  imageQuality: number;
  logImages: boolean;
  cropFactor: number;
  cropImage: boolean;
  templateFormat: number;
  videoRecord: boolean;
  videoRecordRate: number;
  videoRecordScale: number;
  videoRecordType: number;
  /**
   * Html div container. Div container where widget will be populated.
   * @param {Object} c - the div container
   */
  setContainer(c: any): void;
  /**
   * Get div container attached to widget.
   * @return {Object} div container
   */
  getContainer(): any;
  /**
   * Widget language as two letter iso string format (Default language 'es').
   * @param {string} l - the language as two letter iso string format
   */
  setLanguage(l: string): void;
  /**
   * Get language setup.
   * @return {string} language setup
   */
  getLanguage(): string;
  /**
   * List of available dpi resources. Array of different dpi resolutions resources will accept.<br />
   * Default dpi resolutions: 163, 326, 489
   * @param {number[]} list - List of available dpi resources
   */
  setDpiList(list: number[]): void;
  /**
   * Get dpi resolutions.
   * @return {number[]} dpi resolutions
   */
  getDpiList(): number[];
  /**
   * Set desired camera width resolution (in pixels units).<br />
   * Default camera resolution: 1280x720
   * @param {number} w - desired camera width resolution
   */
  setCameraWidth(w: number): void;
  /**
   * Get desired camera width resolution setup.
   * @return {number} desired camera width resolution
   */
  getCameraWidth(): number;
  /**
   * Set desired camera height resolution (in pixels units).<br />
   * Default camera resolution: 1280x720
   * @param {number} h - desired camera height resolution
   */
  setCameraHeight(h: number): void;
  /**
   * Get desired camera height resolution setup.
   * @return {number} desired camera height resolution
   */
  getCameraHeight(): number;
  /**
   * Set camera type (Front or Back modes supported).
   * @param {number} w - camera type (Front or Back modes supported)
   */
  setCameraType(w: number): void;
  /**
   * Get camera type (Front or Back modes supported).
   * @return {number} camera type (Front or Back modes supported)
   */
  getCameraType(): number;
  /**
   * Enable functionality of having a button to switch the camera
   * @param {boolean} button - if true, the button is enabled
   */
  setCameraSwitchButton(button: boolean): void;
  /**
   * Get functionality of having a button to switch the camera.
   * @return {boolean} if true, the button is enabled
   */
  getCameraSwitchButton(): boolean;
  /**
   * Set camera rotation --> 0: no rotation, 1: 90deg, 2: 180deg, 3: 270deg (default rotation = 0).
   * @param {number} h - camera rotation --> 0: no rotation, 1: 90deg, 2: 180deg, 3: 270deg (default rotation = 0)
   */
  setCameraRotation(h: number): void;
  /**
   * Get camera rotation
   * @return {number} camera rotation
   */
  getCameraRotation(): number;
  /**
   * Set camera ID to initially use the desired camera when starting the process
   * @param {string} m - camera ID
   */
  setCameraId(m: string): void;
  /**
   * Get camera ID
   * @return {string} camera ID
   */
  getCameraId(): string;
  /**
   * Bundle path. Modify path if resources are located in non default widget path.<br />
   * Example: widget with multiple skins must setup resources path to the correct skin.<br />
   * Default path: "./FPhi.Widget.Resources"
   * @param {string} h - path of resources
   */
  setBundlePath(h: string): void;
  /**
   * Get resources path setup.
   * @return {string} resources path setup.
   */
  getBundlePath(): string;
  /**
   * Resources path. Modify path if resources are located in non default widget path.<br />
   * Example: widget with multiple skins must setup resources path to the correct skin.<br />
   * Default path: "./FPhi.Widget.Resources"
   * @param {string} h - path of resources
   */
  setResourcesPath(h: string): void;
  /**
   * Get resources path setup.
   * @return {string} resources path setup.
   */
  getResourcesPath(): string;
  /**
   * Event fired when widget finish without errors.
   * @param {Function} event - Event fired when widget finish without errors.
   */
  setOnExtractionFinish(event: Function): void;
  /**
   * Get onExtractionFinish event.
   * @return {Function} onExtractionFinish event.
   */
  getOnExtractionFinish(): Function;
  /**
   * Event fired if user cancel extraction process.
   * @param {Function} event - Event fired if user cancel extraction process.
   */
  setOnUserCancel(event: Function): void;
  /**
   * Get onUserCancel event.
   * @return {Function} onUserCancel event.
   */
  getOnUserCancel(): Function;
  /**
   * Event fired if internal error occours.
   * @param {Function} event - Event fired if internal error occours.
   */
  setOnExceptionCaptured(event: Function): void;
  /**
   * Get onExceptionCaptured event.
   * @return {Function} onExceptionCaptured event.
   */
  getOnExceptionCaptured(): Function;
  /**
   * Event fired if timeout rised maximum available time for capturing process.
   * @param {Function} event - Event fired if timeout rised maximum available time for capturing process.
   */
  setOnExtractionTimeout(event: Function): void;
  /**
   * Get onExtractionTimeout event.
   * @return {Function} onExtractionTimeout event.
   */
  getOnExtractionTimeout(): Function;
  /**
   * Event fired when wasm module loaded.
   * @param {Function} event - Event fired when wasm module loaded.
   */
  setOnModuleLoaded(event: Function): void;
  /**
   * Get onModuleLoaded event.
   * @return {Function} onModuleLoaded event.
   */
  getOnModuleLoaded(): Function;
  /**
   * Event fired when liveness error occurs.
   * @param {Function} event - Event fired when liveness error occurs.
   */
  setOnLivenessError(event: Function): void;
  /**
   * Get onLivenessError event.
   * @return {Function} onLivenessError event.
   */
  getOnLivenessError(): Function;
  /**
   * Event fired when user click on liveness error button.
   * @param {Function} event - Event fired when user click on liveness error button.
   */
  setOnLivenessErrorButtonClick(event: Function): void;
  /**
   * Get onLivenessErrorButtonClick event.
   * @return {Function} onLivenessErrorButtonClick event.
   */
  getOnLivenessErrorButtonClick(): Function;
  /**
   * Event fired when user click on timeout error button.
   * @param {Function} event - Event fired when user click on timeout error button.
   */
  setOnTimeoutErrorButtonClick(event: Function): void;
  /**
   * Get onTimeoutErrorButtonClick event.
   * @return {Function} onTimeoutErrorButtonClick event.
   */
  getOnTimeoutErrorButtonClick(): Function;
  /**
   * Event fired every time a stabilization event occurs.
   * @param {Function} event - Event fired every time a stabilization event occurs.
   */
  setOnStabilizing(event: Function): void;
  /**
   * Get onStabilizing event.
   * @return {Function} onStabilizing event.
   */
  getOnStabilizing(): Function;
  /**
   * Event fired every time a stabilization event occurs.
   * @param {Function} event - Event fired every time a stabilization event occurs.
   */
  setOnTrackStatus(event: Function): void;
  /**
   * Get onStabilizing event.
   * @return {Function} onStabilizing event.
   */
  getOnTrackStatus(): Function;
  /**
   * Set widget liveness mode.
   * @param {number} m - widget liveness mode.
   */
  setLivenessMode(m: number): void;
  /**
   * Get widget liveness mode.
   * @return {number} widget liveness mode.
   */
  getLivenessMode(): number;
  /**
   * Set tutorial flag.
   * @param {boolean} m - tutorial flag.
   */
  setTutorial(m: boolean): void;
  /**
   * Get tutorial flag.
   * @return {boolean} tutorial flag.
   */
  getTutorial(): boolean;
  /**
   * Set stabilization stage flag.
   * @param {boolean} ss - stabilization stage flag.
   */
  setStabilizationStage(ss: boolean): void;
  /**
   * Get stabilization stage flag.
   * @return {boolean} stabilization stage flag.
   */
  getStabilizationStage(): boolean;
  /**
   * Set livenessPrecision.
   * @param {number} m - livenessPrecision.
   */
  setLivenessPrecision(m: number): void;
  /**
   * Get livenessPrecision.
   * @return {number} livenessPrecision.
   */
  getLivenessPrecision(): number;
  /**
   * Set livenessMoveInitialError.
   * @param {number} m - livenessMoveInitialError.
   */
  setLivenessMoveInitialError(m: number): void;
  /**
   * Get livenessMoveInitialError.
   * @return {number} livenessMoveInitialError.
   */
  getLivenessMoveInitialError(): number;
  /**
   * Set livenessMoveInfoTime.
   * @param {number} m - livenessMoveInfoTime.
   */
  setLivenessMoveInfoTime(m: number): void;
  /**
   * Get livenessMoveInfoTime.
   * @return {number} livenessMoveInfoTime.
   */
  getLivenessMoveInfoTime(): number;
  /**
   * Set interactible.
   * @param {boolean} m - interactible.
   */
  setInteractible(m: boolean): void;
  /**
   * Get interactible.
   * @return {boolean} interactible.
   */
  getInteractible(): boolean;
  /**
   * Set authenticateTime.
   * @param {number} m - authenticateTime.
   */
  setAuthenticateTime(m: number): void;
  /**
   * Get authenticateTime.
   * @return {number} authenticateTime.
   */
  getAuthenticateTime(): number;
  /**
   * Set graphPath.
   * @param {string} m - graphPath.
   */
  setGraphPath(m: string): void;
  /**
   * Get graphPath.
   * @return {string} graphPath.
   */
  getGraphPath(): string;
  /**
   * Set imageFormat.
   * @param {string} m - imageFormat.
   */
  setImageFormat(m: string): void;
  /**
   * Get imageFormat.
   * @return {string} imageFormat.
   */
  getImageFormat(): string;
  /**
   * Set imageQuality.
   * @param {number} m - imageQuality.
   */
  setImageQuality(m: number): void;
  /**
   * Get imageQuality.
   * @return {number} imageQuality.
   */
  getImageQuality(): number;
  /**
   * Set logImages.
   * @param {boolean} m - logImages.
   */
  setLogImages(m: boolean): void;
  /**
   * Get logImages.
   * @return {boolean} logImages.
   */
  getLogImages(): boolean;
  /**
   * Set cropFactor.
   * @param {number} m - cropFactor.
   */
  setCropFactor(m: number): void;
  /**
   * Get cropFactor.
   * @return {number} cropFactor.
   */
  getCropFactor(): number;
  /**
   * Set cropImage.
   * @param {boolean} m - cropImage.
   */
  setCropImage(m: boolean): void;
  /**
   * Get cropImage.
   * @return {boolean} cropImage.
   */
  getCropImage(): boolean;
  /**
   * Set templateFormat.
   * @param {number} m - templateFormat.
   */
  setTemplateFormat(m: number): void;
  /**
   * Get templateFormat.
   * @return {number} templateFormat.
   */
  getTemplateFormat(): number;
  /**
   * Set videoRecord.
   * @param {boolean} value - videoRecord.
   */
  setVideoRecord(value: boolean): void;
  /**
   * Get videoRecord.
   * @return {boolean} videoRecord.
   */
  getVideoRecord(): boolean;
  /**
   * Set videoRecordRate.
   * @param {number} value - videoRecordRate.
   */
  setVideoRecordRate(value: number): void;
  /**
   * Get videoRecordRate.
   * @return {number} videoRecordRate.
   */
  getVideoRecordRate(): number;
  /**
   * Set videoRecordScale.
   * @param {number} value - videoRecordScale.
   */
  setVideoRecordScale(value: number): void;
  /**
   * Get videoRecordScale.
   * @return {number} videoRecordScale.
   */
  getVideoRecordScale(): number;
  /**
   * Set videoRecordType.
   * @param {number} value - videoRecordType.
   */
  setVideoRecordType(value: number): void;
  /**
   * Get videoRecordType.
   * @return {number} videoRecordType.
   */
  getVideoRecordType(): number;
  /**
   * Set showLog.
   * @param {boolean} value - showLog.
   */
  setShowLog(value: boolean): void;
  /**
   * Get showLog.
   * @return {boolean} showLog.
   */
  getShowLog(): boolean;
}
