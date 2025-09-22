import { useState } from 'react';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { Button } from '@progress/kendo-react-buttons';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { useProducts, useCategories } from '../services/productService';
import { Product } from '../services/productService';

const ProductCatalog = () => {
  const [filter, setFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const { data: products, isLoading, error } = useProducts();
  const { data: categories } = useCategories();

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error.message}</div>;

  const filteredProducts = products?.filter((product: Product) => 
    product.title.toLowerCase().includes(filter.toLowerCase()) &&
    (selectedCategory === '' || product.categoryId === selectedCategory)
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Catalogue des Produits</h1>
      
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Rechercher..."
          className="border rounded p-2"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        
        <DropDownList
          data={categories || []}
          textField="name"
          valueField="id"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.value)}
          placeholder="Toutes catégories"
        />
      </div>

      
      <Grid
        data={filteredProducts}
        style={{ height: '600px' }}
      >
        <GridColumn field="title" title="Nom" />
        <GridColumn field="price" title="Prix" />
        <GridColumn field="category.name" title="Catégorie" />
        <GridColumn field="user.location" title="Localisation" />
        <GridColumn
          title="Actions"
          cell={(props) => (
            <Button themeColor="primary" onClick={() => console.log('Voir', props.dataItem)}>
              Voir détails
            </Button>
          )}
        />
      </Grid>
    </div>
  );
};

export default ProductCatalog;