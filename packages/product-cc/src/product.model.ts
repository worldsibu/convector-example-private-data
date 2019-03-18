import * as yup from 'yup';
import {
  ConvectorModel,
  Default,
  ReadOnly,
  Required,
  Validate
} from '@worldsibu/convector-core';

export class MarbleTransientInput extends ConvectorModel<MarbleTransientInput> {
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

export class Marble extends ConvectorModel<Marble> {
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

export class MarblePrivateDetails extends ConvectorModel<MarblePrivateDetails> {
  @ReadOnly()
  @Required()
  public readonly type = 'marble';

  @Validate(yup.string())
  name: string;
  @Validate(yup.number())
  price: number;
}