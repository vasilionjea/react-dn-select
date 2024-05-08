import type { DnSelectItemProps } from './types';
import React, { forwardRef } from 'react';

/**
 * <DnSelectItem />
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
