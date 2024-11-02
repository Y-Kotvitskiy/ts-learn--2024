interface IMovie {
  name: string; //   назва,
  year: number; //  рік випуску,
  rate: string; // рейтинг,
  awards: string[]; // список нагород
}

enum GridFilterTypeEnum {
  Match = 'match',
  Range = 'range',
  Values = 'values',
}

type FilerType<T> = T extends GridFilterTypeEnum.Match
  ? string
  : T extends GridFilterTypeEnum.Range
  ? number
  : T extends GridFilterTypeEnum.Values
  ? string[]
  : never;

type SearchFilterTypes = GridFilterTypeEnum.Match | GridFilterTypeEnum.Range;
type ValueFilterTypes = string;

type GreedFilterValue<T extends SearchFilterTypes> = {
  type: T;
  filter: FilerType<T>;
  filterTo?: FilerType<T>;
};

type GreedFilterValues = Partial<Record<SearchFilterTypes, GreedFilterValue<SearchFilterTypes>>>;

type EqualFilterSetValues = FilerType<GridFilterTypeEnum.Values>;

interface IMovies {
  applySearchValue(gridFilter: GreedFilterValue<SearchFilterTypes>): void;
  applyFiltersValue(equalFilter: EqualFilterSetValues): void;
  getFilteredByName(): IMovie[];
  getFilteredByYear(): IMovie[];
  getFilteredByRate(): IMovie[];
  getFilteredByAwards(): IMovie[];
}

interface IMoviesCategory {
  name: string; //   назва,
  movies: IMovies;
}

interface ICategory {
  applySearchMovies(gridFilter: GreedFilterValue<GridFilterTypeEnum.Match | GridFilterTypeEnum.Range>): void;
  applyFiltersMovies(equalFilter: EqualFilterSetValues): void;
  getFilteredByName(): IMoviesCategory[];
}

class Movies implements IMovies {
  constructor(
    private movies: IMovie[],
    private gridFilterValues: GreedFilterValues = {},
    private equalFilterValues: EqualFilterSetValues = []
  ) {}

  applySearchValue(gridFilter: GreedFilterValue<SearchFilterTypes>): void {
    this.gridFilterValues[gridFilter.type] = gridFilter;
  }

  applyFiltersValue(equalFilter: EqualFilterSetValues): void {
    this.equalFilterValues = equalFilter;
  }

  getFilteredByName(): IMovie[] {
    if (!this.gridFilterValues.match) {
      return [];
    }
    const filter = this.gridFilterValues.match.filter.toString().toLocaleLowerCase();
    return this.movies.filter(movie => movie.name.toLowerCase().includes(filter));
  }

  getFilteredByYear(): IMovie[] {
    if (!this.gridFilterValues.range) {
      return [];
    }
    const rangeFilter: GreedFilterValue<GridFilterTypeEnum.Range> = this.gridFilterValues
      .range as GreedFilterValue<GridFilterTypeEnum.Range>;

    if (rangeFilter.filterTo) {
      const filterTo: number = rangeFilter.filterTo as number;
      return this.movies.filter(movie => movie.year >= rangeFilter.filter && movie.year <= filterTo);
    } else {
      return this.movies.filter(movie => movie.year == rangeFilter.filter);
    }
  }

  getFilteredByRate(): IMovie[] {
    if (this.equalFilterValues.length) {
      return this.movies.filter(movie => this.equalFilterValues.find(value => value === movie.rate));
    }
    return [];
  }

  getFilteredByAwards(): IMovie[] {
    throw new Error('Method not implemented.');
  }
}

enum Awards {
  AmericanSociety = 'American Society of Cinematographers',
  MTV = 'MTV Movie & TV Award for Best Villain',
}

enum Rate {
  R17 = '17',
  PG13 = '13',
}

const movies = new Movies([
  {
    name: 'The Shawshank Redemption',
    year: 1994,
    rate: Rate.R17,
    awards: [Awards.AmericanSociety],
  },
  {
    name: 'The Dark Knight',
    year: 2008,
    rate: Rate.PG13,
    awards: [Awards.MTV],
  },
]);

movies.applySearchValue({
  type: GridFilterTypeEnum.Match,
  filter: 'The Shawshank Redemption',
});

movies.applySearchValue({
  type: GridFilterTypeEnum.Range,
  filter: 1990,
  filterTo: 2000,
});

console.log('getFilteredByYear', movies.getFilteredByYear());

movies.applySearchValue({
  type: GridFilterTypeEnum.Range,
  filter: 2008,
});

console.log('getFilteredByYear', movies.getFilteredByYear());

movies.applyFiltersValue([Rate.R17]);

console.log('getFilteredByRate', movies.getFilteredByRate());

// abstract class Categories implements ICategory {
//   private categoryMovies: IMoviesCategory[] = [];
//   private gridFilterValues: GreedFilterValue<GridFilterTypeEnum.Match>[] = [];
//   abstract applySearchValue(gridFilter: GreedFilterValue<GridFilterTypeEnum.Match>): void;

//   public applySearchMovies(gridFilter: GreedFilterValue<GridFilterTypeEnum.Match | GridFilterTypeEnum.Range>): void {
//     this.categoryMovies.forEach(moviesCatefory => moviesCatefory.movies.applySearchValue(gridFilter));
//   }

//   public applyFiltersMovies(equalFilter: EqualFilterSetValues<'rate' | 'awards'>): void {
//     this.categoryMovies.forEach(moviesCatefory => moviesCatefory.movies.applyFiltersValue(equalFilter));
//   }
//   abstract getFilteredMovies(): IMoviesCategory[];
// }
