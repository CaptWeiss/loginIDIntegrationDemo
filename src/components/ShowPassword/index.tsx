export default function ShowPassword({ show }: { show: boolean }) {
  return <span data-pasword-visibility>{show ? 'hide' : 'show'}</span>;
}
