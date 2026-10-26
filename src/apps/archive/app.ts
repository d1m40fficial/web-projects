import { mountArchiveGallery } from './gallery';

export function mount(root: HTMLElement): () => void {
  return mountArchiveGallery(root);
}
