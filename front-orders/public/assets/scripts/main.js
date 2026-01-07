import { FPhi } from './selphi-widget-web.min.js';
import { WidgetErrorEnum } from './types/widget-error.enum.js';

(function () {
  let dropdownCameraResolution;
  let checkboxInteractible;
  let checkboxStabilizationStage;
  let checkboxFaceTracking;
  let checkboxCameraSwitchButton;

  getDemoValues();
  async function getDemoValues() {
    const capabilities = await checkCapabilities();
    if (capabilities.camera && capabilities.wasm && capabilities.browser) {
      startWidget();
    } else {
      stopWidget();
    }
    dropdownCameraResolution = document.getElementById('cameraResolution');
    checkboxInteractible = document.getElementById('interactible');
    checkboxStabilizationStage = document.getElementById('stabilizationStage');
    checkboxFaceTracking = document.getElementById('faceTracking');
    checkboxCameraSwitchButton = document.getElementById('cameraSwitchButton');
  }

  function startWidget() {
    document.getElementById('fPhiWidgetContainer').innerHTML = '';
    getWidgetInstance();
  }

  function stopWidget() {
    document.getElementById('fPhiWidgetContainer').innerHTML = '';
  }

  function getWidgetInstance() {
    let widgetInstance = document.createElement(`facephi-selphi`);

    // para pruebas https://webinversiones-test.delfosti.site/assets/selphi
    widgetInstance.setAttribute(
      'bundlePath',
      'https://webinversiones-test.delfosti.site/assets/selphi'
    );
    widgetInstance.setAttribute('language', 'es');
    widgetInstance.setAttribute('cameraWidth', parseInt(1280));
    widgetInstance.setAttribute('cameraHeight', parseInt(720));
    widgetInstance.setAttribute('cameraType', FPhi.Selphi.CameraType.Front);
    widgetInstance.setAttribute('interactible', false);
    widgetInstance.setAttribute('enableGenerateTemplateRaw', true);
    widgetInstance.setAttribute('stabilizationStage', true);
    widgetInstance.setAttribute('cameraSwitchButton', false);
    widgetInstance.setAttribute('faceTracking', false);
    widgetInstance.setAttribute('timeout', 30000);
    widgetInstance.setAttribute('imageFormat', 'image/jpeg');
    widgetInstance.setAttribute('imageQuality', 0.95);
    widgetInstance.setAttribute('cropFactor', 1.5);
    widgetInstance.setAttribute(
      'livenessMode',
      FPhi.Selphi.LivenessMode.Passive
    );

    widgetInstance.addWidgetEventListener('onExtractionFinish', (data) => {
      window.onExtractionFinish(data);
    });
    widgetInstance.addWidgetEventListener('onUserCancel', onUserCancel);
    widgetInstance.addWidgetEventListener(
      'onExceptionCaptured',
      onExceptionCaptured
    );
    widgetInstance.addWidgetEventListener(
      'onExtractionTimeout',
      onExtractionTimeout
    );
    widgetInstance.addWidgetEventListener(
      'onTimeoutErrorButtonClick',
      onTimeoutErrorButtonClick
    );

    document.getElementById('fPhiWidgetContainer').append(widgetInstance);
  }

  function onExceptionCaptured(exceptionResult) {
    switch (exceptionResult.detail.exceptionType) {
      case FPhi.Selphi.ExceptionType.CameraError:
        window.onErrorWidget(WidgetErrorEnum.CAMERA_ERROR);
        break;
      case FPhi.Selphi.ExceptionType.UnexpectedCaptureError:
        window.onErrorWidget(WidgetErrorEnum.UNEXPECTED_ERROR);
        break;
      case FPhi.Selphi.ExceptionType.InitializingEngineError:
        window.onErrorWidget(WidgetErrorEnum.INITIALIZING_ERROR);
        break;
    }

    stopWidget();
  }

  function onUserCancel() {
    window.onErrorWidget(WidgetErrorEnum.USER_CANCEL);
  }

  function onExtractionTimeout() {
    window.onErrorWidget(WidgetErrorEnum.EXTRACTION_TIMEOUT);
  }

  function onTimeoutErrorButtonClick() {
    window.onErrorWidget(WidgetErrorEnum.TIMEOUT);
  }

  async function checkCapabilities() {
    const capabilities = await FPhi.Selphi.CheckCapabilities();
    return capabilities;
  }
})();
