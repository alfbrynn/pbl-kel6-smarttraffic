import React from 'react';

/**
 * Interface untuk Props PageHeader
 */
interface PageHeaderProps {
  title: string;
  subtitle: React.ReactNode;
  actions?: React.ReactNode;
}

/**
 * Komponen PageHeader Generik
 * Digunakan untuk menampilkan judul halaman, sub-informasi, dan tombol aksi di kanan secara konsisten.
 */
const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actions }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-black text-foreground dark:text-black tracking-tight">{title}</h1>
        <div className="text-sm text-muted mt-1 font-semibold flex items-center gap-1.5">
          {subtitle}
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-3 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
