import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'

export function useClients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)

  // Load all clients from Supabase on mount
  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('fechaRegistro', { ascending: false })
    if (!error && data) setClients(data)
    setLoading(false)
  }

  const addClient = async (data) => {
    const newClient = {
      ...data,
      fechaRegistro: new Date().toISOString(),
    }
    const { data: inserted, error } = await supabase
      .from('clients')
      .insert([newClient])
      .select()
      .single()
    if (!error && inserted) {
      setClients(prev => [inserted, ...prev])
      return inserted.id
    }
    return null
  }

  const updateClient = async (id, data) => {
    const { data: updated, error } = await supabase
      .from('clients')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    if (error) {
      console.error('Update error:', error)
      alert('Error saving changes: ' + error.message)
      return
    }
    if (updated) {
      setClients(prev => prev.map(c => c.id === id ? updated : c))
    }
  }

  const deleteClient = async (id) => {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)
    if (!error) {
      setClients(prev => prev.filter(c => c.id !== id))
    }
  }

  const getClientById = (id) => clients.find(c => c.id === id)

  const getClientsByIndustria = (industria) =>
    clients.filter(c => {
      const efectiva = c.industria === 'Other' ? c.industriaPersonalizada : c.industria
      return efectiva === industria || c.industria === industria
    })

  return { clients, loading, addClient, updateClient, deleteClient, getClientById, getClientsByIndustria }
}
