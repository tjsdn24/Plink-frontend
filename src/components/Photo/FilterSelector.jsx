import ItemSelector from './ItemSelector';

export default function FilterSelector({ filter, setFilter }) {
  const filters = ['none', 'grayscale', 'sepia', 'bright', 'contrast', 'saturate'];

  return (
    <ItemSelector
      items={filters}
      selected={filter}
      onSelect={setFilter}
      renderItem={f => f} // 텍스트 출력
    />
  );
}
