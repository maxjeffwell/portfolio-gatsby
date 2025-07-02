import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { useTheme } from '../context/ThemeContext';
import { FaSearch, FaTimes } from 'react-icons/fa';

const FilterContainer = styled.div`
  background-color: ${(props) => props.theme.colors.secondary};
  border: 2px solid ${(props) => props.theme.colors.border};
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  transition: all ${(props) => props.theme.transitions.normal};
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  font-size: 1rem;
  font-family: SabonLTStd-Roman, serif;
  border: 2px solid ${(props) => props.theme.colors.border};
  border-radius: 6px;
  background-color: ${(props) => props.theme.colors.surface};
  color: ${(props) => props.theme.colors.textInverse};
  transition: all ${(props) => props.theme.transitions.normal};

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.accentSecondary};
    box-shadow: 0 0 0 2px ${(props) => props.theme.colors.accentSecondary}40;
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.textSecondary}80;
  }
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${(props) => props.theme.colors.accent};
  font-size: 1rem;
`;

const ClearButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.accent};
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  transition: all ${(props) => props.theme.transitions.fast};

  &:hover {
    background-color: ${(props) => props.theme.colors.accent}20;
  }

  &:focus {
    outline: 2px solid ${(props) => props.theme.colors.accentSecondary};
    outline-offset: 2px;
  }
`;

const FilterSection = styled.div`
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterLabel = styled.label`
  display: block;
  font-family: AvenirLTStd-Roman, sans-serif;
  font-size: 1rem;
  font-weight: bold;
  color: ${(props) => props.theme.colors.accentSecondary};
  margin-bottom: 0.5rem;
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.5rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }
`;

const FilterCheckbox = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all ${(props) => props.theme.transitions.fast};
  font-family: SabonLTStd-Roman, serif;
  color: ${(props) => props.theme.colors.text};

  &:hover {
    background-color: ${(props) => props.theme.colors.primary}40;
  }

  input {
    margin-right: 0.5rem;
    accent-color: ${(props) => props.theme.colors.accentSecondary};
  }
`;

const ResultsCount = styled.div`
  text-align: center;
  font-family: AvenirLTStd-Roman, sans-serif;
  color: ${(props) => props.theme.colors.accent};
  font-size: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${(props) => props.theme.colors.border};
`;

const ProjectFilter = ({ onFilterChange, totalResults }) => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTechnologies, setSelectedTechnologies] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState('');

  const technologies = [
    'React',
    'GraphQL',
    'Redux',
    'MongoDB',
    'PostgreSQL',
    'Redis',
    'CSS',
    'Vercel',
    'NPM',
    'Git',
    'Heroku',
    'Travis CI',
  ];

  const dateRanges = [
    { value: '', label: 'All Time' },
    { value: '2019', label: '2019' },
    { value: '2020', label: '2020' },
    { value: '2021', label: '2021+' },
  ];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onFilterChange({
      searchTerm: value,
      technologies: selectedTechnologies,
      dateRange: selectedDateRange,
    });
  };

  const handleTechnologyChange = (tech) => {
    const updatedTechnologies = selectedTechnologies.includes(tech)
      ? selectedTechnologies.filter((t) => t !== tech)
      : [...selectedTechnologies, tech];

    setSelectedTechnologies(updatedTechnologies);
    onFilterChange({
      searchTerm,
      technologies: updatedTechnologies,
      dateRange: selectedDateRange,
    });
  };

  const handleDateRangeChange = (e) => {
    const value = e.target.value;
    setSelectedDateRange(value);
    onFilterChange({
      searchTerm,
      technologies: selectedTechnologies,
      dateRange: value,
    });
  };

  const clearSearch = () => {
    setSearchTerm('');
    onFilterChange({
      searchTerm: '',
      technologies: selectedTechnologies,
      dateRange: selectedDateRange,
    });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedTechnologies([]);
    setSelectedDateRange('');
    onFilterChange({
      searchTerm: '',
      technologies: [],
      dateRange: '',
    });
  };

  const hasActiveFilters = searchTerm || selectedTechnologies.length > 0 || selectedDateRange;

  return (
    <FilterContainer theme={theme}>
      <SearchContainer>
        <SearchInput
          theme={theme}
          type="text"
          placeholder="Search projects by title or description..."
          value={searchTerm}
          onChange={handleSearchChange}
          aria-label="Search projects"
        />
        {searchTerm ? (
          <ClearButton theme={theme} onClick={clearSearch} aria-label="Clear search">
            <FaTimes />
          </ClearButton>
        ) : (
          <SearchIcon theme={theme} />
        )}
      </SearchContainer>

      <FilterSection>
        <FilterLabel theme={theme}>Filter by Technology</FilterLabel>
        <FilterGrid>
          {technologies.map((tech) => (
            <FilterCheckbox key={tech} theme={theme}>
              <input
                type="checkbox"
                checked={selectedTechnologies.includes(tech)}
                onChange={() => handleTechnologyChange(tech)}
                aria-label={`Filter by ${tech}`}
              />
              {tech}
            </FilterCheckbox>
          ))}
        </FilterGrid>
      </FilterSection>

      <FilterSection>
        <FilterLabel theme={theme}>Filter by Year</FilterLabel>
        <select
          value={selectedDateRange}
          onChange={handleDateRangeChange}
          aria-label="Filter by year"
          css={css`
            padding: 0.5rem;
            font-family: SabonLTStd-Roman, serif;
            border: 2px solid ${theme.colors.border};
            border-radius: 6px;
            background-color: ${theme.colors.surface};
            color: ${theme.colors.textInverse};
            cursor: pointer;

            &:focus {
              outline: none;
              border-color: ${theme.colors.accentSecondary};
            }
          `}
        >
          {dateRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </FilterSection>

      {hasActiveFilters && (
        <div
          css={css`
            margin-top: 1rem;
            text-align: center;
          `}
        >
          <button
            onClick={clearAllFilters}
            css={css`
              background-color: ${theme.colors.accent};
              color: ${theme.colors.textInverse};
              border: none;
              padding: 0.5rem 1rem;
              border-radius: 6px;
              font-family: SabonLTStd-Roman, serif;
              cursor: pointer;
              transition: all ${theme.transitions.fast};

              &:hover {
                background-color: ${theme.colors.accentSecondary};
              }

              &:focus {
                outline: 2px solid ${theme.colors.accentSecondary};
                outline-offset: 2px;
              }
            `}
          >
            Clear All Filters
          </button>
        </div>
      )}

      <ResultsCount theme={theme}>
        {totalResults} {totalResults === 1 ? 'project' : 'projects'} found
      </ResultsCount>
    </FilterContainer>
  );
};

ProjectFilter.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  totalResults: PropTypes.number.isRequired,
};

export default ProjectFilter;
