'use client';

import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../../lib/api';
import { mockGroups, mockNumbers, OFFLINE_NOTE } from '../../lib/mock';
import Table from '../../components/Table';

export default function ContactsPage() {
  const [groups, setGroups] = useState<any[]>(mockGroups);
  const [groupId, setGroupId] = useState('');
  const [numbers, setNumbers] = useState<string[]>(mockNumbers);
  const [newGroup, setNewGroup] = useState('');
  const [newNumbers, setNewNumbers] = useState('');
  const [offline, setOffline] = useState(false);
  const [msg, setMsg] = useState('');

  async function loadGroups() {
    try {
      const live = await apiGet<any>('/contacts/groups');
      const list = Array.isArray(live) ? live : live?.data ?? [];
      if (list.length) {
        setGroups(list);
        setOffline(false);
        return list;
      }
      throw new Error('empty');
    } catch {
      setOffline(true);
      setGroups(mockGroups);
      return mockGroups;
    }
  }

  async function loadNumbers(id: string) {
    if (!id) return;
    try {
      const live = await apiGet<any>(`/contacts/groups/${id}/numbers`);
      const list = Array.isArray(live) ? live : live?.data ?? live?.numbers ?? [];
      setNumbers(list.map((n: any) => (typeof n === 'string' ? n : n.mobile ?? JSON.stringify(n))));
      setOffline(false);
    } catch {
      setOffline(true);
      setNumbers(mockNumbers);
    }
  }

  useEffect(() => {
    (async () => {
      const list = await loadGroups();
      const first = list[0]?.id;
      if (first) {
        setGroupId(first);
        loadNumbers(first);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function createGroup(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await apiPost('/contacts/groups', { name: newGroup });
      setMsg('Group created.');
      setNewGroup('');
      loadGroups();
    } catch (err: any) {
      setMsg(`Couldn't save group — offline demo data.`);
    }
  }

  async function addNumbers(e: React.FormEvent) {
    e.preventDefault();
    const list = newNumbers.split(/[\s,;]+/).map((s) => s.trim()).filter(Boolean);
    if (!groupId) {
      setMsg('Pick a group first.');
      return;
    }
    try {
      const res = await apiPost(`/contacts/groups/${groupId}/numbers`, { numbers: list });
      setMsg('Numbers added.');
      setNewNumbers('');
      loadNumbers(groupId);
    } catch (err: any) {
      setMsg(`Couldn't add numbers — offline demo data.`);
    }
  }

  return (
    <main className="container page">
      <h1>Contacts</h1>
      {offline && <p className="muted">{OFFLINE_NOTE}</p>}
      {msg ? <p className="ok">{msg}</p> : null}
      <div className="grid">
        <div>
          <h2>Groups</h2>
          <Table columns={['id', 'name']} rows={groups.map((g: any) => [g.id, g.name])} />
          <form className="form" onSubmit={createGroup} style={{ marginTop: 8 }}>
            <label>New group name<input value={newGroup} onChange={(e) => setNewGroup(e.target.value)} /></label>
            <button className="btn">Create group</button>
          </form>
        </div>
        <div>
          <h2>Numbers</h2>
          <label>Group
            <select value={groupId} onChange={(e) => { setGroupId(e.target.value); loadNumbers(e.target.value); }}>
              {groups.map((g: any) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </label>
          <Table columns={['mobile']} rows={numbers.map((n) => [n])} />
          <form className="form" onSubmit={addNumbers} style={{ marginTop: 8 }}>
            <label>Add numbers<textarea rows={3} value={newNumbers} onChange={(e) => setNewNumbers(e.target.value)} /></label>
            <button className="btn">Add numbers</button>
          </form>
        </div>
      </div>
    </main>
  );
}
