import React, { Component } from 'react';

import { notifyError } from '@/common/components';

export const WidgetErrorEnum = {
  TIMEOUT: 'TIMEOUT',
  EXTRACTION_TIMEOUT: 'EXTRACTION_TIMEOUT',
  USER_CANCEL: 'USER_CANCEL',
  CAMERA_ERROR: 'CAMERA_ERROR',
  UNEXPECTED_ERROR: 'UNEXPECTED_ERROR',
  INITIALIZING_ERROR: 'INITIALIZING_ERROR',
};

interface IndexState {
  isWidgetCaptureStarted: boolean;
  interactible: boolean;
  stabilizationStage: boolean;
  cameraSwitchButton: boolean;
  faceTracking: boolean;
  showLog: boolean;
  renderChild?: boolean;
  cameraType?: string;
}

interface FacePhiComponentProps {
  thing?: string;
  onValidate: (token: any) => void;
  setIsOpen: (open: boolean) => void;
}

declare global {
  interface Window {
    onExtractionFinish?: (extractionResult: any) => void;
    onErrorWidget?: (errorResult: any) => void;
  }
}

export default class FacePhiComponent extends Component<
  FacePhiComponentProps,
  IndexState
> {
  constructor(props: FacePhiComponentProps) {
    super(props);

    // Initializing state
    this.state = {
      isWidgetCaptureStarted: false,
      interactible: true,
      stabilizationStage: true,
      cameraSwitchButton: false,
      faceTracking: false,
      showLog: false,
      renderChild: true,
    };
  }

  componentDidMount() {
    const cacheBust = new Date().getTime();
    const script = document.createElement('script');
    script.src = `/assets/scripts/main.js?cache_bust=${cacheBust}`;
    script.type = 'module';
    script.async = true;
    document.body.appendChild(script);
    window.onExtractionFinish = this.onExtractionFinish.bind(this);
    window.onErrorWidget = this.onErrorWidget.bind(this);
    return () => {
      document.body.removeChild(script);
    };
  }

  componentWillUnmount(): void {
    window.onExtractionFinish = undefined;
    document.getElementById('fPhiWidgetContainer')!.innerHTML = '';
  }

  onExtractionFinish = (extractionResult: any) => {
    if (
      extractionResult.detail.templateRaw ||
      this.props.thing !== 'validation'
    ) {
      this.props.onValidate(extractionResult.detail);
    } else {
      this.props.onValidate(extractionResult.detail);
    }
  };

  onErrorWidget = (errorResult: keyof typeof WidgetErrorEnum) => {
    switch (errorResult) {
      case WidgetErrorEnum.TIMEOUT:
        notifyError({
          title: '¡Ups! Tiempo agotado',
          subtitle:
            'Parece que el tiempo de espera se ha agotado. Por favor, inténtalo de nuevo.',
        });
        break;
      case WidgetErrorEnum.INITIALIZING_ERROR:
        notifyError({
          title: '¡Oh no! Error al iniciar',
          subtitle:
            'Hubo un problema al intentar iniciar el widget. Por favor, recarga la página e inténtalo nuevamente.',
        });
        break;
      case WidgetErrorEnum.CAMERA_ERROR:
        notifyError({
          title: '¡Error de cámara!',
          subtitle:
            'Parece que hay un problema con la cámara. Asegúrate de que esté conectada correctamente e inténtalo de nuevo.',
        });
        break;
      case WidgetErrorEnum.EXTRACTION_TIMEOUT:
        notifyError({
          title: '¡Tiempo de extracción agotado!',
          subtitle:
            'El tiempo para realizar la extracción se ha agotado. Por favor, vuelve a intentarlo.',
        });
        break;
      case WidgetErrorEnum.UNEXPECTED_ERROR:
        notifyError({
          title: '¡Oops! Error inesperado',
          subtitle:
            'Se produjo un error inesperado. Por favor, intenta nuevamente más tarde o ponte en contacto con nuestro equipo de soporte.',
        });
        break;
      case WidgetErrorEnum.USER_CANCEL:
        notifyError({
          title: 'Operación cancelada',
          subtitle: 'La operación fue cancelada por el usuario.',
        });
        break;
    }
    this.props.setIsOpen(false);
  };

  render() {
    return (
      <>
        <div className='d-flex flex-column justify-content-between align-items-stretch min-h-100 bg-light'>
          <section className='flex-grow-1 d-flex align-items-stretch'>
            <div id='root' className='d-flex flex-grow-1 align-items-stretch'>
              <div className='container p-3'>
                <div className='row h-100'>
                  {/* Selphi Web Widget Container */}
                  {this.state.renderChild && (
                    <div className='col-12 col-md-9'>
                      <div
                        id='fPhiWidgetContainer'
                        style={{ height: '96%' }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </>
    );
  }
}
