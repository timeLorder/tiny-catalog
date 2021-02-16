export interface Title {
  id: string;
  tagName: string;
  level: number;
  text: string;
}

export interface DeepSearchOptions {
  noDeeperIfFound: boolean;
}

export interface CatalogOptions {
  customTitleTag?: string;
  deepSearch?: boolean | DeepSearchOptions;
}

type VagueElement = Element | undefined | null;

const defaultOptions = {
  deepSearch: false,
};

export class Catalog {
  private wrapper: HTMLElement | null;
  private options: CatalogOptions;
  private titles: Title[] = [];

  constructor(target: string | HTMLElement, options?: CatalogOptions) {
    this.wrapper =
      typeof target === 'string' ? document.querySelector(target) : target;
    this.options = {
      ...defaultOptions,
      ...options,
    };
    this.searchTitles();
  }

  getTitles() {
    return this.titles;
  }

  recognizeTitle(node: Element) {
    const titleMatch = node.tagName.match(/^H(1|2|3|4|5|6)$/);
    const isCustomTitleTag =
      this.options.customTitleTag?.toUpperCase() === node.tagName;
    const isTitle = this.options.customTitleTag
      ? isCustomTitleTag
      : !!titleMatch;
    const titleLevel =
      !this.options.customTitleTag && titleMatch ? parseInt(titleMatch[1]) : 1;

    return {
      isTitle,
      titleLevel,
    };
  }

  searchTitles(root: VagueElement = this.wrapper) {
    if (!root) return;
    if (root === this.wrapper) this.titles = [];

    let noDeeper = false;
    if (
      typeof this.options.deepSearch === 'object' &&
      this.options.deepSearch.noDeeperIfFound
    ) {
      for (const node of Array.from(root.children)) {
        if (this.recognizeTitle(node).isTitle) {
          noDeeper = true;
          break;
        }
      }
    }

    Array.from(root.children).forEach(node => {
      const { isTitle, titleLevel } = this.recognizeTitle(node);

      // ignore title tag without text content
      if (isTitle && node.textContent) {
        const id = node.outerHTML.match(/\sid="(.*?)"/)?.[1] || '';
        this.titles.push({
          id: encodeURIComponent(id),
          tagName: node.tagName,
          level: titleLevel,
          text: node.textContent,
        });
      } else if (this.options.deepSearch && node.children.length && !noDeeper) {
        this.searchTitles(node);
      }
    });
  }

  renew() {
    //
  }

  on() {
    //
  }

  destroy() {
    //
  }
}
