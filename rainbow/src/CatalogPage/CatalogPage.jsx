import '../main.css'
import './CatalogPage.css'
import { Link, useSearchParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react'
import Catalog from '../HomePage/Сatalog'


export default function CatalogPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const searchQuery = searchParams.get('q') || '';
    const [filters, setFilters] = useState({
        category: searchParams.get('category') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        manufacturer: searchParams.get('manufacturer') || '',
        manufacturerSearch: '',
        inStock: searchParams.get('inStock') === 'true',
    });
    const [categories, setCategories] = useState([]);
    const [manufacturers, setManufacturers] = useState([]);
    const [filteredManufacturers, setFilteredManufacturers] = useState([]);
    const [showAllManufacturers, setShowAllManufacturers] = useState(false);
    const [loading, setLoading] = useState({
        categories: true,
        manufacturers: true
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(prev => ({ ...prev, categories: true, manufacturers: true }));

                const categoriesResponse = await fetch('http://localhost:3009/api/categories');
                const categoriesData = await categoriesResponse.json();
                setCategories(categoriesData);

                const manufacturersResponse = await fetch('http://localhost:3009/api/manufacturers');
                const manufacturersData = await manufacturersResponse.json();
                setManufacturers(manufacturersData);
                setFilteredManufacturers(['Все производители', ...manufacturersData.slice(0, 2)]);

            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            } finally {
                setLoading(prev => ({ ...prev, categories: false, manufacturers: false }));
            }
        };

        loadData();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (name === 'manufacturerSearch') {
            const searchValue = value.toLowerCase();
            if (searchValue === '') {
                setFilteredManufacturers(['Все производители', ...manufacturers.slice(0, 2)]);
                setShowAllManufacturers(false);
            } else {
                const filtered = manufacturers.filter(man => 
                    man.toLowerCase().includes(searchValue)
                );
                setFilteredManufacturers(['Все производители', ...filtered]);
            }
            setFilters(prev => ({ ...prev, [name]: value }));
        } else {
            setFilters(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleManufacturerSelect = (manufacturer) => {
        if (manufacturer === 'Все производители') {
            setFilters(prev => ({
                ...prev,
                manufacturer: '',
                manufacturerSearch: ''
            }));
            setFilteredManufacturers(['Все производители', ...manufacturers.slice(0, 2)]);
        } else {
            setFilters(prev => ({
                ...prev,
                manufacturer,
                manufacturerSearch: manufacturer
            }));
        }
        setShowAllManufacturers(false);
    };

    const toggleShowAllManufacturers = () => {
        setShowAllManufacturers(!showAllManufacturers);
        setFilteredManufacturers(
            showAllManufacturers 
                ? ['Все производители', ...manufacturers.slice(0, 2)]
                : ['Все производители', ...manufacturers]
        );
    };

    const applyFilters = () => {
        const params = new URLSearchParams();
        
        if (searchQuery) params.set('q', searchQuery);
        if (filters.category) params.set('category', filters.category);
        if (filters.minPrice) params.set('minPrice', filters.minPrice);
        if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
        if (filters.manufacturer && filters.manufacturer !== 'Все производители') {
            params.set('manufacturer', filters.manufacturer);
        }
        if (filters.inStock) params.set('inStock', 'true');

        setSearchParams(params);
    };

    return (
        <section className='catalogpage'>
            <div className="container">
                <div className="catalogpage-inner">
                    <div className='navigation'>
                        <Link to='/Главная'>Главная</Link>
                        <span>/</span>
                        <Link to='/Каталог'>Каталог</Link>
                    </div>
                    <div className="catalog-layout">
                        <aside className="filter-sidebar">
                            <h3>Фильтры</h3>
                            
                            <div className="filter-group">
                                <label>Категория:</label>
                                {loading.categories ? (
                                    <div>Загрузка...</div>
                                ) : (
                                    <select
                                        name="category"
                                        value={filters.category}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="">Все категории</option>
                                        {categories.map((cat, i) => (
                                            <option key={`cat-${i}`} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <div className="filter-group manufacturer-filter">
                        <label>Производитель:</label>
                        {loading.manufacturers ? (
                            <div>Загрузка...</div>
                        ) : (
                            <>
                                <input
                                    type="text"
                                    name="manufacturerSearch"
                                    placeholder="Поиск"
                                    value={filters.manufacturerSearch}
                                    onChange={handleFilterChange}
                                    className="manufacturer-search"
                                />
                                <div className="manufacturer-options">
                                    {filteredManufacturers.map((man, i) => (
                                        <div 
                                            key={`man-${i}`}
                                            className={`manufacturer-option ${
                                                (filters.manufacturer === man || 
                                                (man === 'Все производители' && !filters.manufacturer)) 
                                                ? 'selected' : ''
                                            }`}
                                            onClick={() => handleManufacturerSelect(man)}
                                        >
                                            {man}
                                        </div>
                                    ))}
                                    {manufacturers.length > 2 && !showAllManufacturers && (
                                        <button 
                                            className="show-more"
                                            onClick={toggleShowAllManufacturers}
                                        >
                                            Показать все ({manufacturers.length})
                                        </button>
                                    )}
                                    {showAllManufacturers && (
                                        <button 
                                            className="show-less"
                                            onClick={toggleShowAllManufacturers}
                                        >
                                            Свернуть
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                            <div className="filter-group">
                                <label>Цена от:</label>
                                <input
                                    type="number"
                                    name="minPrice"
                                    value={filters.minPrice}
                                    onChange={handleFilterChange}
                                />
                                <label>до:</label>
                                <input
                                    type="number"
                                    name="maxPrice"
                                    value={filters.maxPrice}
                                    onChange={handleFilterChange}
                                />
                            </div>

                            <div className="filter-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="inStock"
                                        checked={filters.inStock}
                                        onChange={handleFilterChange}
                                    />
                                    <span className="checkmark"></span>
                                    В наличии
                                </label>
                            </div>

                            <button
                                className="apply-button"
                                onClick={applyFilters}
                                disabled={loading.categories || loading.manufacturers}
                            >
                                Применить
                            </button>
                        </aside>

                        <div className="catalog-content">
                            <Catalog searchQuery={searchQuery} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}