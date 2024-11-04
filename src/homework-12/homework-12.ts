interface IMovie {
  name: string; //   назва,
  year: number; //  рік випуску,
  rate: number; // рейтинг,
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

type CategoryFilterValues = Partial<Record<SearchFilterTypes, GreedFilterValue<GridFilterTypeEnum.Match>>>;

type EqualFilterSetValues = FilerType<GridFilterTypeEnum.Values>;

interface IMovies {
  applySearchValue(gridFilter: GreedFilterValue<SearchFilterTypes>): void;
  applyFiltersValue(equalFilter: EqualFilterSetValues): void;
  filteredByName(): IMovie[];
  filteredByYear(): IMovie[];
  filteredByRate(): IMovie[];
  filteredByAwards(): IMovie[];
}

interface IMoviesCategory {
  name: string; //   назва,
  movies: IMovies;
}

interface ICategory {
  applySearchMovies(gridFilter: GreedFilterValue<GridFilterTypeEnum.Match>): void;
  filteredByName(): IMoviesCategory[];
}

class Movies implements IMovies {
  constructor(
    private movies: IMovie[],
    private gridFilterValues: GreedFilterValues = {},
    private equalFilterValues: EqualFilterSetValues = []
  ) {}

  public applySearchValue(gridFilter: GreedFilterValue<SearchFilterTypes>): void {
    this.gridFilterValues[gridFilter.type] = gridFilter;
  }

  public applyFiltersValue(equalFilter: EqualFilterSetValues): void {
    this.equalFilterValues = equalFilter;
  }

  private filterByValues(movies: IMovie[], fieldName: keyof IMovie): IMovie[] {
    return movies.filter(movie => this.equalFilterValues.find(value => value == movie[fieldName].toString()));
  }

  public filteredByName(): IMovie[] {
    let result: IMovie[] = this.movies;

    if (this.gridFilterValues.match) {
      const filter = this.gridFilterValues.match.filter.toString().toLocaleLowerCase();
      result = this.movies.filter(movie => movie.name.toLowerCase().includes(filter));
    }

    if (this.equalFilterValues.length > 0) {
      result = this.filterByValues(result, 'name');
    }
    return result;
  }

  filteredByYear(): IMovie[] {
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

  filteredByRate(): IMovie[] {
    if (this.gridFilterValues.range) {
      const rangeFilter: GreedFilterValue<GridFilterTypeEnum.Range> = this.gridFilterValues
        .range as GreedFilterValue<GridFilterTypeEnum.Range>;
      if (rangeFilter.filterTo) {
        const filterTo: number = rangeFilter.filterTo as number;
        return this.movies.filter(movie => movie.rate >= rangeFilter.filter && movie.rate <= filterTo);
      } else {
        return this.movies.filter(movie => movie.rate == rangeFilter.filter);
      }
    }
    return [];
  }

  filteredByAwards(): IMovie[] {
    if (this.equalFilterValues.length > 0) {
      return this.filterByValues(this.movies, 'awards');
    }
    return [];
  }
}

class Categories implements ICategory {
  constructor(
    private moviesCategories: IMoviesCategory[],
    private gridFilterValues: CategoryFilterValues = {}
  ) {}
  applySearchMovies(gridFilter: GreedFilterValue<GridFilterTypeEnum.Match>): void {
    this.gridFilterValues[gridFilter.type] = gridFilter;
  }

  public filteredByName(): IMoviesCategory[] {
    if (!this.gridFilterValues.match) {
      return [];
    }
    const filter = this.gridFilterValues.match.filter.toString().toLocaleLowerCase();
    return this.moviesCategories.filter(moviesCategory => moviesCategory.name.toLowerCase().includes(filter));
  }
}

enum Awards {
  AmericanSociety = 'American Society of Cinematographers',
  MTV = 'MTV Movie & TV Award for Best Villain',
}

const moviesTest = () => {
  const movies = new Movies([
    {
      name: 'The Shawshank Redemption',
      year: 1994,
      rate: 17,
      awards: [Awards.AmericanSociety],
    },
    {
      name: 'The Dark Knight',
      year: 2008,
      rate: 13,
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

  console.log('filteredByYear: 1990-2000', movies.filteredByYear());

  movies.applySearchValue({
    type: GridFilterTypeEnum.Range,
    filter: 2008,
  });

  console.log('filteredByYear: 2008', movies.filteredByYear());

  movies.applySearchValue({
    type: GridFilterTypeEnum.Range,
    filter: 13,
    filterTo: 17,
  });

  console.log('filteredByRate: 13-17', movies.filteredByRate());

  movies.applySearchValue({
    type: GridFilterTypeEnum.Range,
    filter: 13,
  });

  console.log('filteredByRate: 13', movies.filteredByRate());

  movies.applyFiltersValue([Awards.AmericanSociety]);

  console.log(`filteredByAwards: ${Awards.AmericanSociety}`, movies.filteredByAwards());
};

moviesTest();

const categoryTest = () => {
  const movies = new Movies([
    {
      name: 'The Shawshank Redemption',
      year: 1994,
      rate: 17,
      awards: [Awards.AmericanSociety],
    },
    {
      name: 'The Dark Knight',
      year: 2008,
      rate: 13,
      awards: [Awards.MTV],
    },
  ]);

  const categories = new Categories([{ name: 'Top movies', movies }]);
  categories.applySearchMovies({
    type: GridFilterTypeEnum.Match,
    filter: 'Top',
  });

  console.log(`filteredByName: Top`, categories.filteredByName());

  categories.applySearchMovies({
    type: GridFilterTypeEnum.Match,
    filter: 'Tops',
  });

  console.log(`filteredByName: Tops`, categories.filteredByName());
};

categoryTest();
