import { Client } from '@notionhq/client'

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

export const notionClient = notion

export interface NotionDestination {
  id: string
  name: string
  description: string
  category: string
  coordinates: { lat: number; lng: number }
  driveTime: number
  highlights: string[]
  tips: string[]
  photos: string[]
  lastUpdated: string
}

export const notionService = {
  async syncDestinationsToNotion() {
    try {
      const response = await notion.databases.query({
        database_id: process.env.NOTION_DATABASE_ID!,
        sorts: [
          {
            property: 'Last updated',
            direction: 'descending'
          }
        ]
      })
      return { success: true, results: response.results }
    } catch (error) {
      console.error('Notion sync error:', error)
      return { success: false, error }
    }
  },

  async createDestination(destination: NotionDestination) {
    try {
      const response = await notion.pages.create({
        parent: { database_id: process.env.NOTION_DATABASE_ID! },
        properties: {
          'Name': {
            title: [
              {
                text: {
                  content: destination.name
                }
              }
            ]
          },
          'Description': {
            rich_text: [
              {
                text: {
                  content: destination.description
                }
              }
            ]
          },
          'Category': {
            select: {
              name: destination.category
            }
          },
          'Drive Time': {
            number: destination.driveTime
          },
          'Coordinates': {
            rich_text: [
              {
                text: {
                  content: `${destination.coordinates.lat}, ${destination.coordinates.lng}`
                }
              }
            ]
          },
          'Highlights': {
            multi_select: destination.highlights.map(h => ({ name: h }))
          },
          'Last updated': {
            date: {
              start: new Date().toISOString()
            }
          }
        }
      })
      return { success: true, page: response }
    } catch (error) {
      console.error('Notion create destination error:', error)
      return { success: false, error }
    }
  },

  async updateDestination(pageId: string, updates: Partial<NotionDestination>) {
    try {
      const properties: any = {}
      
      if (updates.name) {
        properties['Name'] = {
          title: [{ text: { content: updates.name } }]
        }
      }
      
      if (updates.description) {
        properties['Description'] = {
          rich_text: [{ text: { content: updates.description } }]
        }
      }
      
      if (updates.category) {
        properties['Category'] = {
          select: { name: updates.category }
        }
      }
      
      if (updates.driveTime) {
        properties['Drive Time'] = {
          number: updates.driveTime
        }
      }
      
      if (updates.highlights) {
        properties['Highlights'] = {
          multi_select: updates.highlights.map(h => ({ name: h }))
        }
      }
      
      properties['Last updated'] = {
        date: { start: new Date().toISOString() }
      }
      
      const response = await notion.pages.update({
        page_id: pageId,
        properties
      })
      return { success: true, page: response }
    } catch (error) {
      console.error('Notion update destination error:', error)
      return { success: false, error }
    }
  },

  async getOlympicVenues() {
    try {
      const response = await notion.databases.query({
        database_id: process.env.NOTION_OLYMPIC_DATABASE_ID!,
        filter: {
          property: 'Type',
          select: {
            equals: 'Olympic Venue'
          }
        }
      })
      return { success: true, venues: response.results }
    } catch (error) {
      console.error('Notion get Olympic venues error:', error)
      return { success: false, error }
    }
  },

  async getTripKits() {
    try {
      const response = await notion.databases.query({
        database_id: process.env.NOTION_TRIPKITS_DATABASE_ID!,
        sorts: [
          {
            property: 'Created',
            direction: 'descending'
          }
        ]
      })
      return { success: true, tripKits: response.results }
    } catch (error) {
      console.error('Notion get TripKits error:', error)
      return { success: false, error }
    }
  },

  async createTripKit(tripKit: {
    name: string
    description: string
    destinations: string[]
    price: number
    category: string
  }) {
    try {
      const response = await notion.pages.create({
        parent: { database_id: process.env.NOTION_TRIPKITS_DATABASE_ID! },
        properties: {
          'Name': {
            title: [{ text: { content: tripKit.name } }]
          },
          'Description': {
            rich_text: [{ text: { content: tripKit.description } }]
          },
          'Category': {
            select: { name: tripKit.category }
          },
          'Price': {
            number: tripKit.price
          },
          'Destinations': {
            multi_select: tripKit.destinations.map(d => ({ name: d }))
          },
          'Status': {
            select: { name: 'Draft' }
          },
          'Created': {
            date: { start: new Date().toISOString() }
          }
        }
      })
      return { success: true, page: response }
    } catch (error) {
      console.error('Notion create TripKit error:', error)
      return { success: false, error }
    }
  },

  async getContentPages() {
    try {
      const response = await notion.databases.query({
        database_id: process.env.NOTION_CONTENT_DATABASE_ID!,
        filter: {
          property: 'Status',
          select: {
            equals: 'Published'
          }
        },
        sorts: [
          {
            property: 'Published',
            direction: 'descending'
          }
        ]
      })
      return { success: true, pages: response.results }
    } catch (error) {
      console.error('Notion get content pages error:', error)
      return { success: false, error }
    }
  }
} 