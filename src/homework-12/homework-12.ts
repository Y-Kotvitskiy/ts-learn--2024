interface IMovie {
  name: string; //   назва,
  year: number; //  рік випуску,
  rate: number; // рейтинг,
  awards: string; // список нагород
}

enum GridFilterTypeEnum {
  Match = 'match',
  Range = 'range',
  Equal = 'equal',
}

type GridFilteredField = 'name' | 'year';

type FilerType<T> = T extends GridFilterTypeEnum.Match
  ? IMovie['name']
  : T extends GridFilterTypeEnum.Range
  ? IMovie['year']
  : never;

type GreedFilterValue<T extends GridFilterTypeEnum.Match | GridFilterTypeEnum.Range> = {
  type: T;
  filter: FilerType<T>;
  filterTo?: FilerType<T>;
};

type EqualFilteredField = 'rate' | 'awards';

type EqualFilterValue<T extends EqualFilteredField> = {
  type: GridFilterTypeEnum.Equal;
  field: EqualFilteredField;
  value: IMovie[T];
};

type EqualFilterSetValues<T extends EqualFilteredField> = {
  values: EqualFilterValue<T>[];
};

interface IMovies {
  applySearchValue(gridFilter: GreedFilterValue<GridFilterTypeEnum.Match | GridFilterTypeEnum.Range>): void;
  applyFiltersValue(equalFilter: EqualFilterSetValues<'rate' | 'awards'>): void;
  getFilteredMovies(): IMovie[];
}

interface IMoviesCategory {
  name: string; //   назва,
  movies: IMovies;
}

interface ICategory {
  applySearchValue(gridFilter: GreedFilterValue<GridFilterTypeEnum.Match>): void;
  applySearchMovies(gridFilter: GreedFilterValue<GridFilterTypeEnum.Match | GridFilterTypeEnum.Range>): void;
  applyFiltersMovies(equalFilter: EqualFilterSetValues<'rate' | 'awards'>): void;
  getFilteredMovies(): IMoviesCategory[];
}

abstract class Movies implements IMovies {
  private movies: IMovie[] = [];
  private gridFilterValues: GreedFilterValue<GridFilterTypeEnum.Match | GridFilterTypeEnum.Range>[] = [];
  private equalFilterValues: EqualFilterSetValues<'rate' | 'awards'>[] = [];
  abstract applySearchValue(gridFilter: GreedFilterValue<GridFilterTypeEnum.Match | GridFilterTypeEnum.Range>): void;
  abstract applyFiltersValue(equalFilter: EqualFilterSetValues<'rate' | 'awards'>): void;
  abstract getFilteredMovies(): IMovie[];
}

abstract class Categories implements ICategory {
  private categoryMovies: IMoviesCategory[] = [];
  private gridFilterValues: GreedFilterValue<GridFilterTypeEnum.Match>[] = [];
  abstract applySearchValue(gridFilter: GreedFilterValue<GridFilterTypeEnum.Match>): void;

  public applySearchMovies(gridFilter: GreedFilterValue<GridFilterTypeEnum.Match | GridFilterTypeEnum.Range>): void {
    this.categoryMovies.forEach(moviesCatefory => moviesCatefory.movies.applySearchValue(gridFilter));
  }

  public applyFiltersMovies(equalFilter: EqualFilterSetValues<'rate' | 'awards'>): void {
    this.categoryMovies.forEach(moviesCatefory => moviesCatefory.movies.applyFiltersValue(equalFilter));
  }
  abstract getFilteredMovies(): IMoviesCategory[];
}
