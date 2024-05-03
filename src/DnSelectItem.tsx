import React, { forwardRef } from 'react';
import { DnSelectItemProps } from './types';

/**
 * DnSelectItem
 */
const DnSelectItem = forwardRef(
  (
    { children, isSelected = false }: DnSelectItemProps,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) => {
    return (
      <div
        ref={ref}
        className={`dn-select-item ${isSelected ? 'selected' : ''}`}
      >
        {children}
      </div>
    );
  },
);

export default DnSelectItem;
