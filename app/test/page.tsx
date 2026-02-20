"use client";
import { useState } from "react";
import Link from "next/link";
// import PageShell from "../shared/PageShell";

const ALL_PRODUCTS = [
  { id:"p1", name:"Air Jordan 1 Retro High OG", sku:"AJ1-001",  status:"ACTIVE",  tokenId:"#2847", scans:1247, minted:"Feb 19, 2026" },
  { id:"p2", name:"Air Jordan 4 Retro",          sku:"AJ4-002",  status:"ACTIVE",  tokenId:"#2848", scans:892,  minted:"Feb 19, 2026" },
  { id:"p3", name:"Air Max 90 OG",               sku:"AM90-001", status:"DRAFT",   tokenId:"—",     scans:0,    minted:"—" },
  { id:"p4", name:"Jordan Shorts Classic",        sku:"JSC-004",  status:"PENDING", tokenId:"—",     scans:0,    minted:"—" },
  { id:"p5", name:"Nike Dunk Low Retro",          sku:"NDL-005",  status:"ACTIVE",  tokenId:"#2849", scans:543,  minted:"Feb 20, 2026" },
  { id:"p6", name:"Air Force 1 '07",             sku:"AF1-006",  status:"ACTIVE",  tokenId:"#2850", scans:311,  minted:"Feb 20, 2026" },
];

type Status = "ALL" | "ACTIVE" | "DRAFT" | "PENDING";

export default function BrandProductsPage() {
  const [filter, setFilter] = useState<Status>("ALL");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = ALL_PRODUCTS.filter(p => {
    const matchStatus = filter === "ALL" || p.status === filter;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const toggleSelect = (id: string) =>
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  return (
    <>
      <style>{`
        .products-header {
          padding: 48px 5vw 32px;
          border-bottom: 1px solid rgba(184,154,106,0.15);
          display: flex; justify-content: space-between;
          align-items: flex-end; flex-wrap: wrap; gap: 20px;
        }

        .filter-bar {
          padding: 20px 5vw;
          border-bottom: 1px solid rgba(184,154,106,0.12);
          display: flex; justify-content: space-between;
          align-items: center; gap: 16px; flex-wrap: wrap;
        }

        .filter-tabs { display: flex; gap: 4px; }

        .filter-tab {
          padding: 7px 18px; border-radius: 100px;
          font-size: 11px; letter-spacing: 0.08em;
          text-transform: uppercase; cursor: pointer;
          border: 1px solid transparent;
          font-family: 'DM Sans', sans-serif; font-weight: 400;
          color: var(--stone); background: transparent;
        }

        .filter-tab.active {
          background: var(--ink); color: var(--cream);
          border-color: var(--ink);
        }

        .search-wrap { position: relative; }
        .search-icon {
          position: absolute; left: 14px; top: 50%;
          transform: translateY(-50%);
          width: 14px; height: 14px;
          stroke: var(--stone); fill: none;
          stroke-width: 1.5; stroke-linecap: round;
        }
        .search-input {
          padding: 9px 16px 9px 38px;
          border: 1px solid rgba(184,154,106,0.25);
          border-radius: 100px; font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          color: var(--ink); background: white; outline: none;
          width: 240px;
        }
        .search-input:focus { border-color: var(--gold); }
        .search-input::placeholder { color: rgba(140,131,120,0.5); }

        .products-body { padding: 32px 5vw 80px; }

        /* Bulk action bar */
        .bulk-bar {
          display: flex; align-items: center; gap: 14px;
          padding: 12px 20px;
          background: rgba(184,154,106,0.06);
          border: 1px solid rgba(184,154,106,0.2);
          border-radius: 12px; margin-bottom: 20px;
          font-size: 13px; color: var(--ink);
        }

        /* Product table */
        .checkbox {
          width: 16px; height: 16px;
          border: 1px solid rgba(184,154,106,0.4);
          border-radius: 4px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; background: white;
        }
        .checkbox.checked { background: var(--ink); border-color: var(--ink); }

        .product-name-cell { font-size: 14px; font-weight: 500; color: var(--ink); letter-spacing: -0.01em; margin-bottom: 2px; }
        .product-sku       { font-size: 11px; color: var(--stone); font-family: monospace; }

        .scan-bar {
          width: 80px; height: 4px;
          background: rgba(184,154,106,0.15); border-radius: 100px;
          overflow: hidden; display: inline-block;
        }
        .scan-fill { height: 100%; background: var(--gold); border-radius: 100px; }

        .row-actions { display: flex; gap: 8px; opacity: 0; }
        tr:hover .row-actions { opacity: 1; }

        .row-action-btn {
          background: none; border: 1px solid rgba(184,154,106,0.25);
          border-radius: 8px; padding: 5px 12px;
          font-size: 10px; letter-spacing: 0.08em;
          text-transform: uppercase; color: var(--stone);
          cursor: pointer; font-family: 'DM Sans', sans-serif;
        }
        .row-action-btn:hover { border-color: var(--gold); color: var(--ink); }

        .empty-state {
          text-align: center; padding: 80px 24px;
          border: 1px solid rgba(184,154,106,0.15);
          border-radius: 20px; background: white;
        }
        .empty-icon { margin-bottom: 16px; color: rgba(184,154,106,0.4); }
        .empty-title { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 800; color: var(--ink); margin-bottom: 8px; }
        .empty-sub { font-size: 13px; color: var(--stone); margin-bottom: 24px; }
      `}</style>

      {/* Header */}
      <div className="products-header">
        <div>
          <div className="page-eyebrow">Brand · Nike</div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(28px,4vw,52px)", fontWeight:900, letterSpacing:"-0.03em", color:"var(--ink)", lineHeight:0.95 }}>
            Products
          </h1>
          <div style={{ fontSize:13, color:"var(--stone)", fontWeight:300, marginTop:8 }}>
            {ALL_PRODUCTS.length} products registered · {ALL_PRODUCTS.filter(p=>p.status==="ACTIVE").length} active on-chain
          </div>
        </div>
        <Link href="/product/add" className="btn btn-ink">
          + Add Product <span className="btn-arr">↗</span>
        </Link>
      </div>

      {/* Filter bar */}
      <div className="filter-bar">
        <div className="filter-tabs">
          {(["ALL","ACTIVE","DRAFT","PENDING"] as Status[]).map(f => (
            <button key={f} className={`filter-tab${filter===f?" active":""}`} onClick={() => setFilter(f)}>
              {f === "ALL" ? `All (${ALL_PRODUCTS.length})` : `${f} (${ALL_PRODUCTS.filter(p=>p.status===f).length})`}
            </button>
          ))}
        </div>

        <div className="search-wrap">
          <svg className="search-icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            className="search-input"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="products-body">
        {/* Bulk action bar */}
        {selected.length > 0 && (
          <div className="bulk-bar">
            <span style={{ color:"var(--stone)", fontWeight:400 }}>{selected.length} selected</span>
            <button className="btn btn-ghost" style={{ padding:"6px 16px", fontSize:12 }} onClick={() => setSelected([])}>Clear</button>
            <button className="btn btn-danger" style={{ padding:"6px 16px", fontSize:12 }}>Delete</button>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
              </svg>
            </div>
            <div className="empty-title">No products found</div>
            <div className="empty-sub">Try adjusting your filter or search term.</div>
            <Link href="/product/add" className="btn btn-ink">Add First Product <span className="btn-arr">↗</span></Link>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th style={{ width:40 }}></th>
                {["Product","Token","Scans","Status","Minted",""].map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td>
                    <div
                      className={`checkbox${selected.includes(p.id)?" checked":""}`}
                      onClick={() => toggleSelect(p.id)}
                    >
                      {selected.includes(p.id) && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="product-name-cell">{p.name}</div>
                    <div className="product-sku">{p.sku}</div>
                  </td>
                  <td style={{ fontFamily:"monospace", fontSize:12 }}>{p.tokenId}</td>
                  <td>
                    {p.scans > 0 ? (
                      <div>
                        <div style={{ fontSize:13, fontWeight:500, marginBottom:4 }}>{p.scans.toLocaleString()}</div>
                        <div className="scan-bar">
                          <div className="scan-fill" style={{ width:`${Math.min(100, (p.scans/1500)*100)}%` }} />
                        </div>
                      </div>
                    ) : <span style={{ color:"var(--stone)", fontSize:12 }}>—</span>}
                  </td>
                  <td>
                    <span className={`badge ${p.status==="ACTIVE"?"badge-green":p.status==="PENDING"?"badge-gold":"badge-stone"}`}>
                      <span className={`sdot ${p.status==="ACTIVE"?"sdot-green":p.status==="PENDING"?"sdot-gold":"sdot-stone"}`}/>
                      {p.status}
                    </span>
                  </td>
                  <td style={{ color:"var(--stone)", fontSize:12 }}>{p.minted}</td>
                  <td>
                    <div className="row-actions">
                      <button className="row-action-btn">View</button>
                      {p.status === "DRAFT" && <button className="row-action-btn" style={{ color:"var(--gold)", borderColor:"rgba(184,154,106,0.4)" }}>Mint</button>}
                      <button className="row-action-btn">Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}