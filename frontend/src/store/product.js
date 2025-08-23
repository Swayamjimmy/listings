// frontend/src/store/product.js
import { create } from "zustand";

// Helper function to get auth token
const getAuthToken = () => {
  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      return parsed.state?.token || null;
    }
    return null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

export const useProductStore = create((set) => ({
  products: [],
  storeInfo: null,
  setProducts: (products) => set({ products }),

  createProduct: async (newProduct) => {
    const token = getAuthToken();

    if (!token) {
      return { success: false, message: "Please login to create products" };
    }

    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      return { success: false, message: "Please fill in all fields." };
    }

    const res = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(newProduct),
    });

    const data = await res.json();
    if (data.success) {
      set((state) => ({ products: [...state.products, data.data] }));
      return { success: true, message: "Product created successfully" };
    } else {
      return { success: false, message: data.message };
    }
  },

  fetchProducts: async (username = null) => {
    try {
      let url = "/api/products";
      let headers = {
        "Content-Type": "application/json",
      };

      if (username) {
        // Public view - fetch products by username
        url += `?username=${username}`;
      } else {
        // Private view - fetch authenticated user's products
        const token = getAuthToken();
        
        if (!token) {
          return { success: false, message: "Please login to view your products" };
        }
        
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await fetch(url, { headers });
      const data = await res.json();
      
      if (data.success) {
        set({ products: data.data });
        return { success: true };
      } else {
        set({ products: [] });
        return { success: false, message: data.message };
      }
    } catch (error) {
        console.error(error);
      set({ products: [] });
      return { success: false, message: "Failed to fetch products" };
    }
  },

  deleteProduct: async (pid) => {
    const token = getAuthToken();

    if (!token) {
      return { success: false, message: "Please login to delete products" };
    }

    const res = await fetch(`/api/products/${pid}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (data.success) {
      // Update the UI immediately, without needing a refresh
      set((state) => ({ 
        products: state.products.filter((product) => product._id !== pid) 
      }));
      return { success: true, message: "Product deleted successfully" };
    } else {
      return { success: false, message: data.message };
    }
  },

  updateProduct: async (pid, updatedProduct) => {
    const token = getAuthToken();

    if (!token) {
      return { success: false, message: "Please login to update products" };
    }

    const res = await fetch(`/api/products/${pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(updatedProduct),
    });

    const data = await res.json();
    if (data.success) {
      // Update the UI immediately, without needing a refresh
      set((state) => ({
        products: state.products.map((product) =>
          product._id === pid ? data.data : product
        ),
      }));
      return { success: true, message: "Product updated successfully" };
    } else {
      return { success: false, message: data.message };
    }
  },

  // Fetch store info for public view
  fetchStoreInfo: async (username) => {
    try {
      const res = await fetch(`/api/auth/store/${username}`);
      const data = await res.json();
      
      if (data.success) {
        set({ storeInfo: data.data });
        return { success: true, data: data.data };
      } else {
        set({ storeInfo: null });
        return { success: false, message: data.message };
      }
    } catch (error) {
        console.error(error);
      set({ storeInfo: null });
      return { success: false, message: "Failed to fetch store info" };
    }
  },

  // Clear store info
  clearStoreInfo: () => set({ storeInfo: null }),
}));