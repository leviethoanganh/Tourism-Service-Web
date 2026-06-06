interface Props {
  currentPage: number;
  totalPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPage, onPageChange }: Props) {
  if (totalPage <= 1) return null;

  const pages = Array.from({ length: totalPage }, (_, i) => i + 1);

  return (
    <div className="box-pagination">
      <div className="inner-list-button">
        <button onClick={() => onPageChange(1)} disabled={currentPage === 1}>
          <i className="fa-solid fa-angles-left" />
        </button>
        {pages.map(p => (
          <button
            key={p}
            className={p === currentPage ? 'active' : ''}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}
        <button onClick={() => onPageChange(totalPage)} disabled={currentPage === totalPage}>
          <i className="fa-solid fa-angles-right" />
        </button>
      </div>
    </div>
  );
}
