import * as yup from 'yup';
import {
  ConvectorModel,
  Default,
  ReadOnly,
  Required,
  Validate
} from '@worldsibu/convector-core-model';

export class marbleTransientInput extends ConvectorModel<marbleTransientInput> {
  @ReadOnly()
  @Required()
  public readonly type = 'marbleTransientInput';

  @Validate(yup.string())
  name: string;
  @Validate(yup.string())
  color: string;
  @Validate(yup.string())
  owner: string;
  @Validate(yup.number())
  size: number;
  @Validate(yup.number())
  price: number;
}
export class marble extends ConvectorModel<marble> {
  @ReadOnly()
  @Required()
  public readonly type = 'marble';

  @Validate(yup.string())
  name: string;
  @Validate(yup.string())
  color: string;
  @Validate(yup.string())
  owner: string;
  @Validate(yup.number())
  size: number;
}
export class marblePrivateDetails extends ConvectorModel<marblePrivateDetails> {
  @ReadOnly()
  @Required()
  public readonly type = 'marble';

  @Validate(yup.string())
  name: string;
  @Validate(yup.number())
  price: number;
}