import React from 'react'

export interface OverlayRef {
  show: (view: any) => number;
  hide: (key: any) => void;
  View: React.ForwardRefExoticComponent<React.RefAttributes<any>>;
  PopView: React.ForwardRefExoticComponent<React.RefAttributes<any>>;
  PullView: React.ForwardRefExoticComponent<React.RefAttributes<any>>;
  [p: string]: any;
}

export interface ItemProps {
  refInstance?: any;
  [p: string]: any;
}
