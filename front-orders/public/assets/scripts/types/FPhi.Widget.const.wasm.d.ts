import { Widget } from './FPhi.Widget.wasm';
import { TokenizerUtils } from './FPhi.Widget.tokenizer';
import { WidgetComponent } from './FPhi.Widget.component';
import { ConfigurationManager } from './FPhi.Widget.configurator';

export namespace FPhi {
  export namespace Selphi {
    enum LivenessMode {
      None = 0,
      Passive = 3,
    }
    enum ExceptionType {
      CameraError = 0,
      ExtractorError = 1,
      ControlNotInitializedError = 2,
      ImageCropResizeError = 3,
      UnexpectedCaptureError = 4,
      InitializingEngineError = 5,
    }
    enum TemplateFormat {
      ByteArray = 0,
      Base64 = 1,
    }
    enum ImageFormat {
      None = 0,
      Gray_8bpp = 1,
      RGB_24bpp = 2,
      BGR_24bpp = 3,
      ARGB_32bpp = 4,
      YUV_NV21 = 5,
      ABGR_32bpp = 6,
      BGRA_32bpp = 7,
      RGBA_32bpp = 8,
    }
    enum SampleDiagnostic {
      Ok = 0,
      FaceNotFound = 1,
      RightEyeNotFound = 2,
      LeftEyeNotFound = 3,
      EyesNotFound = 4,
      FaceTooFar = 5,
      FaceTooClose = 6,
      TooCloseToWindowSide = 7,
      AngleExceeded = 8,
      QualityCheckFailed = 9,
      NotRated = 10,
    }
    enum FinalDiagnostic {
      InsufficientValidSamples = 0,
      TemplateCreationInProgress = 1,
      TemplateCreated = 2,
    }
    enum LivenessDiagnostic {
      NotRated = 0,
      PhotoDetected = 1,
      LivenessDetected = 2,
      Unsuccess = 3,
      UnsuccessLowPerformance = 4,
      UnsuccessGlasses = 5,
      UnsuccessLight = 6,
      UnsuccessNoMovement = 7,
      UnsuccessWrongDirection = 8,
      UnsuccessTooFar = 9,
    }
    enum RecorderType {
      Local = 0,
      Remote = 1,
    }
    enum CameraType {
      Front = 0,
      Back = 1,
    }
    enum TrackStatus {
      ChangeState = 0,
      Tap = 1,
      FaceState = 2,
    }
    const TokenizerUtils: TokenizerUtils;
    const Widget: Widget;
    const ConfigurationManager: ConfigurationManager;
    const Component: WidgetComponent;
    const Version: number;

    function CheckCapabilities(): {};
  }
}
