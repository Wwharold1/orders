import { ConfigurationManager } from './FPhi.Widget.configurator';

export class Widget {
  public constructor(config: ConfigurationManager);

  public Start(): void;
  public Stop(): void;
  public Finalize(): void;
  public GenerateTemplateRawFromByteArray(
    img: any,
    onFinish: (event: any) => void
  ): void;
}
