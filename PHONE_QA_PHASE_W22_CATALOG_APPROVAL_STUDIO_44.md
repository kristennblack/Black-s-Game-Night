# W22 Phone / Tablet QA — Catalog Approval Studio

1. Open `/catalog-approval-studio.html` on the target device.
2. Confirm Batch 01 shows 100 Cabin Home Essentials items.
3. Switch among Collection Lookbook, Grid / Board and Real-use Proof.
4. Open several Home proofs and verify the 3D room can orbit/zoom and the item reads at believable scale.
5. Open several Avatar proofs and verify the cosmetic overlay stays anchored to the selected avatar rather than floating off the body.
6. Open several World Prop proofs and verify the prop reads at believable scale.
7. Mark examples Approve Concept, Needs Changes and Reject; add notes.
8. Refresh the page and confirm decisions/notes persist on that device.
9. Export `BFGN_W22_Catalog_Review_Decisions.json` and verify it downloads.
10. Import that JSON on a clean review session and confirm decisions restore.
11. Open `/tokens-store.html`; verify it says W22 STAGING.
12. Select an unowned unapproved concept and confirm Preview works but Unlock is blocked as Pending Approval.
13. Confirm existing owned room blueprints/cosmetics remain usable.
14. Verify the approval studio remains usable in portrait and landscape orientation.
15. Report any item whose proof scale, fit, name, category, collection or art direction feels wrong before advancing it.
