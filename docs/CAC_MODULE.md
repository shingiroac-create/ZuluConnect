# Module CAC (achats groupés) dans ZuluConnect

Basé sur « CAC Burundi – Business Model & Plan de Développement 2027-2031 » (document de travail, novembre 2026).

## Parcours
- **Ménages** : Home → « Achats groupés CAC » → cycle en cours (progression vers les paliers) → paniers Essentiel / Famille / Famille Plus ou catalogue → finalisation (retrait ou livraison, Lumicash / Ecocash, code promoteur) → suivi dans « Mes commandes ».
- **B2B** : onglet « Entreprises & ONG » → demande de devis → suivi des demandes.

## Collections Firestore
| Collection | Écriture | Champs principaux |
|---|---|---|
| `cac_cycles` | back-office | `title, zone, status('open'), closesAt, participants, tiers[{households, discountPct}]` |
| `cac_products` | back-office | `name, unit, price, emoji, category, available` |
| `cac_orders` | client (création) | `uid, cycleId, items[], subtotal, deliveryFee, total, deliveryMode, pickupPoint/address, phone, paymentMethod, paymentStatus, status, referralCode, createdAt` |
| `cac_b2b_requests` | client (création) | `uid, orgName, orgType, contactName, phone, email, needs, monthlyBudgetBIF, frequency, zone, status, createdAt` |

Sans données en base (ou sans connexion), l'app affiche des données de démonstration. En accès démo (sans compte), rien n'est écrit dans Firestore.

## Ce qui reste à faire avant un pilote réel
1. **Paiement** : aucune intégration mobile money n'existe. Une commande est créée en `awaiting_payment`; la confirmation du paiement est manuelle ou à intégrer via un prestataire agréé. Ne pas utiliser le wallet promoteurs pour conserver des fonds clients sans validation juridique (le plan CAC le demande).
2. **Recalcul serveur du total** : les prix sont envoyés par le client. Une Cloud Function doit recalculer le total depuis `cac_products` à la création et refuser les écarts.
3. **Compteur `participants`** et **remise de palier** : à maintenir côté serveur (Cloud Function à la confirmation de paiement / clôture du cycle).
4. **Commission promoteur** : le code promoteur est enregistré (`referralCode`). Le taux et le versement sur le wallet à la livraison restent à définir (le plan ne fixe pas de taux). Ne verser que sur commandes livrées.
5. **Back-office** : changement des statuts de commande et de demande B2B, consolidation par produit et par zone.
6. **Valeurs de démonstration** à remplacer : prix, paliers (2/4/6 %), frais de livraison (3 000 BIF), points de retrait, contenu des paniers.
7. **Règles de sécurité** : voir `firestore.rules.cac` (à fusionner avec les règles existantes).
