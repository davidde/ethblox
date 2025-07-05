'use client';

export default function Copyright() {
  return (
    <div className='pt-4 text-sm tracking-wider text-[var(--grey-fg-color)] border-t border-[var(--border-color)]'>
      ΞthBlox © {new Date().getFullYear()}. All rights reserved.
    </div>
  );
}