import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { useTheme } from '../context/ThemeContext';
import { FaSearch, FaTimes } from 'react-icons/fa';

const FilterContainer = styled.div`
  background: ${(props) => props.theme.gradients.secondary};
  border: 2px solid ${(props) => props.theme.colors.border};
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 3rem;
  transition: all ${(props) => props.theme.transitions.normal};
  position: relative;
  box-shadow: ${(props) => props.theme.shadows.medium};
  animation: ${(props) => props.theme.animations.slideUp};
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${(props) => props.theme.gradients.accent};
    border-radius: 20px 20px 0 0;
    animation: shimmer 2s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: ${(props) => props.theme.gradients.accent};
    border-radius: 22px;
    z-index: -1;
    opacity: 0;
    transition: opacity ${(props) => props.theme.transitions.normal};
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) => props.theme.shadows.hover};

    &::after {
      opacity: 0.3;
    }
  }

  @keyframes shimmer {
    0%,
    100% {
      transform: translateX(-100%);
    }
    50% {
      transform: translateX(400%);
    }
  }
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
  border-radius: 12px;
  background-color: ${(props) => props.theme.colors.surface};
  color: ${(props) => props.theme.colors.textInverse};
  transition: all ${(props) => props.theme.transitions.normal};
  position: relative;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.accentSecondary};
    box-shadow:
      0 0 0 3px ${(props) => props.theme.colors.accentSecondary}40,
      0 4px 12px ${(props) => props.theme.colors.accent}20;
    transform: translateY(-1px);
  }

  &:hover:not(:focus) {
    border-color: ${(props) => props.theme.colors.accent};
    box-shadow: 0 2px 8px ${(props) => props.theme.colors.accent}20;
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.textSecondary}80;
    transition: color ${(props) => props.theme.transitions.fast};
  }

  &:focus::placeholder {
    color: ${(props) => props.theme.colors.textSecondary}60;
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
  border-radius: 8px;
  transition: all ${(props) => props.theme.transitions.normal};
  font-family: SabonLTStd-Roman, serif;
  color: ${(props) => props.theme.colors.text};
  position: relative;
  overflow: hidden;
  border: 1px solid transparent;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      ${(props) => props.theme.colors.accent}30,
      transparent
    );
    transition: left ${(props) => props.theme.transitions.normal};
  }

  &:hover {
    background-color: ${(props) => props.theme.colors.primary}40;
    border-color: ${(props) => props.theme.colors.accent}60;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px ${(props) => props.theme.colors.accent}20;

    &::before {
      left: 100%;
    }
  }

  &:has(input:checked) {
    background: ${(props) => props.theme.gradients.accent};
    color: ${(props) => props.theme.colors.textInverse};
    border-color: ${(props) => props.theme.colors.accentSecondary};
    box-shadow: 0 2px 8px ${(props) => props.theme.colors.accent}40;
  }

  input {
    margin-right: 0.5rem;
    accent-color: ${(props) => props.theme.colors.accentSecondary};
    transform: scale(1);
    transition: transform ${(props) => props.theme.transitions.fast};

    &:checked {
      transform: scale(1.1);
    }
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
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedTechnologies, setSelectedTechnologies] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setIsSearching(false);
    }, 300);

    if (searchTerm !== debouncedSearchTerm) {
      setIsSearching(true);
    }

    return () => clearTimeout(timer);
  }, [searchTerm, debouncedSearchTerm]);

  // Update filters when debounced search term changes
  useEffect(() => {
    onFilterChange({
      searchTerm: debouncedSearchTerm,
      technologies: selectedTechnologies,
      dateRange: selectedDateRange,
    });
  }, [debouncedSearchTerm, selectedTechnologies, selectedDateRange, onFilterChange]);

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

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchTerm(value);
  }, []);

  const handleTechnologyChange = useCallback(
    (tech) => {
      const updatedTechnologies = selectedTechnologies.includes(tech)
        ? selectedTechnologies.filter((t) => t !== tech)
        : [...selectedTechnologies, tech];

      setSelectedTechnologies(updatedTechnologies);
    },
    [selectedTechnologies]
  );

  const handleDateRangeChange = useCallback((e) => {
    const value = e.target.value;
    setSelectedDateRange(value);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setSelectedTechnologies([]);
    setSelectedDateRange('');
  }, []);

  const hasActiveFilters =
    debouncedSearchTerm || selectedTechnologies.length > 0 || selectedDateRange;

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
            {typeof window !== 'undefined' && <FaTimes />}
          </ClearButton>
        ) : (
          typeof window !== 'undefined' && <SearchIcon theme={theme} />
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
