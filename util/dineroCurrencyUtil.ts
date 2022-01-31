import {
  AED,
  AFN,
  ALL,
  AMD,
  AOA,
  ARS,
  AUD,
  AWG,
  AZN,
  BAM,
  BBD,
  BDT,
  BGN,
  BHD,
  BIF,
  BMD,
  BND,
  BOB,
  BOV,
  BRL,
  BSD,
  BTN,
  BWP,
  BYN,
  BZD,
  CAD,
  CDF,
  CHE,
  CHF,
  CHW,
  CLF,
  CLP,
  CNY,
  COP,
  COU,
  CRC,
  CUC,
  CUP,
  CVE,
  CZK,
  DJF,
  DKK,
  DOP,
  DZD,
  EGP,
  ERN,
  ETB,
  EUR,
  FJD,
  FKP,
  GBP,
  GEL,
  GHS,
  GIP,
  GMD,
  GNF,
  GTQ,
  GYD,
  HKD,
  HNL,
  HRK,
  HTG,
  HUF,
  IDR,
  ILS,
  INR,
  IQD,
  IRR,
  ISK,
  JMD,
  JOD,
  JPY,
  KES,
  KGS,
  KHR,
  KMF,
  KPW,
  KRW,
  KWD,
  KYD,
  KZT,
  LAK,
  LBP,
  LKR,
  LRD,
  LSL,
  LYD,
  MAD,
  MDL,
  MGA,
  MKD,
  MMK,
  MNT,
  MOP,
  MRU,
  MUR,
  MVR,
  MWK,
  MXN,
  MXV,
  MYR,
  MZN,
  NAD,
  NGN,
  NIO,
  NOK,
  NPR,
  NZD,
  OMR,
  PAB,
  PEN,
  PGK,
  PHP,
  PKR,
  PLN,
  PYG,
  QAR,
  RON,
  RSD,
  RUB,
  RWF,
  SAR,
  SBD,
  SCR,
  SDG,
  SEK,
  SGD,
  SHP,
  SLL,
  SOS,
  SRD,
  SSP,
  STN,
  SVC,
  SYP,
  SZL,
  THB,
  TJS,
  TMT,
  TND,
  TOP,
  TRY,
  TTD,
  TWD,
  TZS,
  UAH,
  UGX,
  USD,
  USN,
  UYI,
  UYU,
  UYW,
  UZS,
  VES,
  VND,
  VUV,
  WST,
  XAF,
  XCD,
  XOF,
  XPF,
  YER,
  ZAR,
  ZMW,
  ZWL,
} from '@dinero.js/currencies';
import { Currency, dinero, Dinero, DineroSnapshot } from 'dinero.js';

export function currencyFromCode(code: string): Currency<number> | undefined {
  switch (code) {
    case 'AED':
      return AED;
    case 'AFN':
      return AFN;
    case 'ALL':
      return ALL;
    case 'AMD':
      return AMD;
    case 'AOA':
      return AOA;
    case 'ARS':
      return ARS;
    case 'AUD':
      return AUD;
    case 'AWG':
      return AWG;
    case 'AZN':
      return AZN;
    case 'BAM':
      return BAM;
    case 'BBD':
      return BBD;
    case 'BDT':
      return BDT;
    case 'BGN':
      return BGN;
    case 'BHD':
      return BHD;
    case 'BIF':
      return BIF;
    case 'BMD':
      return BMD;
    case 'BND':
      return BND;
    case 'BOB':
      return BOB;
    case 'BOV':
      return BOV;
    case 'BRL':
      return BRL;
    case 'BSD':
      return BSD;
    case 'BTN':
      return BTN;
    case 'BWP':
      return BWP;
    case 'BYN':
      return BYN;
    case 'BZD':
      return BZD;
    case 'CAD':
      return CAD;
    case 'CDF':
      return CDF;
    case 'CHE':
      return CHE;
    case 'CHF':
      return CHF;
    case 'CHW':
      return CHW;
    case 'CLF':
      return CLF;
    case 'CLP':
      return CLP;
    case 'CNY':
      return CNY;
    case 'COP':
      return COP;
    case 'COU':
      return COU;
    case 'CRC':
      return CRC;
    case 'CUC':
      return CUC;
    case 'CUP':
      return CUP;
    case 'CVE':
      return CVE;
    case 'CZK':
      return CZK;
    case 'DJF':
      return DJF;
    case 'DKK':
      return DKK;
    case 'DOP':
      return DOP;
    case 'DZD':
      return DZD;
    case 'EGP':
      return EGP;
    case 'ERN':
      return ERN;
    case 'ETB':
      return ETB;
    case 'EUR':
      return EUR;
    case 'FJD':
      return FJD;
    case 'FKP':
      return FKP;
    case 'GBP':
      return GBP;
    case 'GEL':
      return GEL;
    case 'GHS':
      return GHS;
    case 'GIP':
      return GIP;
    case 'GMD':
      return GMD;
    case 'GNF':
      return GNF;
    case 'GTQ':
      return GTQ;
    case 'GYD':
      return GYD;
    case 'HKD':
      return HKD;
    case 'HNL':
      return HNL;
    case 'HRK':
      return HRK;
    case 'HTG':
      return HTG;
    case 'HUF':
      return HUF;
    case 'IDR':
      return IDR;
    case 'ILS':
      return ILS;
    case 'INR':
      return INR;
    case 'IQD':
      return IQD;
    case 'IRR':
      return IRR;
    case 'ISK':
      return ISK;
    case 'JMD':
      return JMD;
    case 'JOD':
      return JOD;
    case 'JPY':
      return JPY;
    case 'KES':
      return KES;
    case 'KGS':
      return KGS;
    case 'KHR':
      return KHR;
    case 'KMF':
      return KMF;
    case 'KPW':
      return KPW;
    case 'KRW':
      return KRW;
    case 'KWD':
      return KWD;
    case 'KYD':
      return KYD;
    case 'KZT':
      return KZT;
    case 'LAK':
      return LAK;
    case 'LBP':
      return LBP;
    case 'LKR':
      return LKR;
    case 'LRD':
      return LRD;
    case 'LSL':
      return LSL;
    case 'LYD':
      return LYD;
    case 'MAD':
      return MAD;
    case 'MDL':
      return MDL;
    case 'MGA':
      return MGA;
    case 'MKD':
      return MKD;
    case 'MMK':
      return MMK;
    case 'MNT':
      return MNT;
    case 'MOP':
      return MOP;
    case 'MRU':
      return MRU;
    case 'MUR':
      return MUR;
    case 'MVR':
      return MVR;
    case 'MWK':
      return MWK;
    case 'MXN':
      return MXN;
    case 'MXV':
      return MXV;
    case 'MYR':
      return MYR;
    case 'MZN':
      return MZN;
    case 'NAD':
      return NAD;
    case 'NGN':
      return NGN;
    case 'NIO':
      return NIO;
    case 'NOK':
      return NOK;
    case 'NPR':
      return NPR;
    case 'NZD':
      return NZD;
    case 'OMR':
      return OMR;
    case 'PAB':
      return PAB;
    case 'PEN':
      return PEN;
    case 'PGK':
      return PGK;
    case 'PHP':
      return PHP;
    case 'PKR':
      return PKR;
    case 'PLN':
      return PLN;
    case 'PYG':
      return PYG;
    case 'QAR':
      return QAR;
    case 'RON':
      return RON;
    case 'RSD':
      return RSD;
    case 'RUB':
      return RUB;
    case 'RWF':
      return RWF;
    case 'SAR':
      return SAR;
    case 'SBD':
      return SBD;
    case 'SCR':
      return SCR;
    case 'SDG':
      return SDG;
    case 'SEK':
      return SEK;
    case 'SGD':
      return SGD;
    case 'SHP':
      return SHP;
    case 'SLL':
      return SLL;
    case 'SOS':
      return SOS;
    case 'SRD':
      return SRD;
    case 'SSP':
      return SSP;
    case 'STN':
      return STN;
    case 'SVC':
      return SVC;
    case 'SYP':
      return SYP;
    case 'SZL':
      return SZL;
    case 'THB':
      return THB;
    case 'TJS':
      return TJS;
    case 'TMT':
      return TMT;
    case 'TND':
      return TND;
    case 'TOP':
      return TOP;
    case 'TRY':
      return TRY;
    case 'TTD':
      return TTD;
    case 'TWD':
      return TWD;
    case 'TZS':
      return TZS;
    case 'UAH':
      return UAH;
    case 'UGX':
      return UGX;
    case 'USD':
      return USD;
    case 'USN':
      return USN;
    case 'UYI':
      return UYI;
    case 'UYU':
      return UYU;
    case 'UYW':
      return UYW;
    case 'UZS':
      return UZS;
    case 'VES':
      return VES;
    case 'VND':
      return VND;
    case 'VUV':
      return VUV;
    case 'WST':
      return WST;
    case 'XAF':
      return XAF;
    case 'XCD':
      return XCD;
    case 'XOF':
      return XOF;
    case 'XPF':
      return XPF;
    case 'YER':
      return YER;
    case 'ZAR':
      return ZAR;
    case 'ZMW':
      return ZMW;
    case 'ZWL':
      return ZWL;
  }
}
